"""Render the real Compose config; no Docker daemon is needed."""
import json
import os
import shutil
import socket
import subprocess
import tempfile
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CADDY = os.environ.get("CADDY_BIN") or shutil.which("caddy")


class GatewayConfigTest(unittest.TestCase):
    @unittest.skipUnless(os.name == "posix", "Package script runs on Linux CI")
    def test_package_contains_only_generic_gateway_files(self):
        self.assertTrue((ROOT / "package.sh").is_file(), "generic gateway packager is missing")
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "release"
            result = subprocess.run(["bash", str(ROOT / "package.sh"), str(target)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual({p.name for p in target.iterdir()}, {"compose.yml", "Caddyfile", "README.md", "checksums.sha256"})
            verify = subprocess.run(["sha256sum", "--check", "checksums.sha256"], cwd=target, capture_output=True)
            self.assertEqual(verify.returncode, 0)

    @unittest.skipUnless(CADDY, "set CADDY_BIN or install Caddy for runtime log checks")
    def test_upstream_failure_never_logs_secret_headers_or_signed_query(self):
        secret = "sentinel-origin-secret-do-not-log"
        signature = "sentinel-signed-query-do-not-log"
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            sites = root / "sites"
            sites.mkdir()
            (sites / "example.caddy").write_text(
                f"http://127.0.0.1:{port} {{\n reverse_proxy 127.0.0.1:0\n import access-log\n}}\n")
            main = root / "Caddyfile"
            main.write_text((ROOT / "Caddyfile").read_text()
                            .replace("/etc/caddy/sites-enabled", sites.as_posix())
                            .replace("127.0.0.1:8080", "127.0.0.1:0"))
            adapted = subprocess.run([CADDY, "adapt", "--config", str(main)], capture_output=True, text=True, check=True)
            config = json.loads(adapted.stdout)
            config["admin"] = {"disabled": True}
            runtime = root / "runtime.json"
            runtime.write_text(json.dumps(config))
            proc = subprocess.Popen([CADDY, "run", "--config", str(runtime)],
                                    env={**os.environ, "APPDATA": str(root),
                                         "XDG_CONFIG_HOME": str(root), "XDG_DATA_HOME": str(root)},
                                    stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            status = None
            try:
                deadline = time.monotonic() + 5
                while time.monotonic() < deadline:
                    req = urllib.request.Request(f"http://127.0.0.1:{port}/media?signature={signature}",
                                                 headers={"X-Origin-Secret": secret})
                    try:
                        with urllib.request.urlopen(req, timeout=1) as response:
                            status = response.status
                        break
                    except urllib.error.HTTPError as error:
                        status = error.code
                        error.close()
                        break
                    except urllib.error.URLError:
                        if proc.poll() is not None:
                            break
                        time.sleep(0.05)
            finally:
                proc.terminate()
                output, _ = proc.communicate(timeout=5)
            self.assertEqual(status, 502, output)
            self.assertNotIn(secret, output)
            self.assertNotIn(signature, output)

    @unittest.skipUnless(CADDY, "set CADDY_BIN or install Caddy to validate site imports")
    def test_site_can_use_shared_log_filter_and_invalid_site_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            site = root / "sites"
            site.mkdir()
            fragment = site / "example.caddy"
            fragment.write_text("http://127.0.0.1:9089 {\n reverse_proxy 127.0.0.1:9000\n import access-log\n}\n")
            main = root / "Caddyfile"
            main.write_text((ROOT / "Caddyfile").read_text().replace("/etc/caddy/sites-enabled", site.as_posix()))
            command = [CADDY, "adapt", "--config", str(main)]
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            adapted = json.loads(result.stdout)
            validated = subprocess.run([CADDY, "validate", "--config", str(main)], capture_output=True, text=True)
            self.assertEqual(validated.returncode, 0, validated.stderr)
            access_log = next(log for log in adapted["logging"]["logs"].values() if "encoder" in log)
            filters = access_log["encoder"]["fields"]
            self.assertEqual(filters["request>headers"]["filter"], "delete")
            self.assertEqual(filters["request>uri"]["filter"], "delete")
            fragment.write_text("this { is { invalid")
            invalid = subprocess.run(command, capture_output=True, text=True)
            self.assertNotEqual(invalid.returncode, 0)

    def test_only_gateway_owns_public_ports_and_persists_tls(self):
        self.assertTrue((ROOT / "compose.yml").is_file(), "gateway Compose file is missing")
        result = subprocess.run(
            ["docker", "compose", "-f", str(ROOT / "compose.yml"), "config", "--format", "json"],
            capture_output=True, text=True, check=True,
        )
        config = json.loads(result.stdout)
        self.assertEqual(set(config["services"]), {"gateway"})
        service = config["services"]["gateway"]
        self.assertEqual({(p["published"], p["protocol"]) for p in service["ports"]},
                         {("80", "tcp"), ("443", "tcp"), ("443", "udp")})
        mounts = {v["target"]: v for v in service["volumes"]}
        self.assertEqual(mounts["/data"]["type"], "volume")
        self.assertEqual(mounts["/config"]["type"], "volume")
        self.assertTrue(mounts["/etc/caddy/Caddyfile"]["read_only"])
        self.assertNotIn("/var/run/docker.sock", mounts)


if __name__ == "__main__":
    unittest.main()
