# Shared HTTPS gateway

Independent Caddy project for one server. Only this project publishes 80/443;
application repositories own their hostnames, upstreams and Compose adapters.
This does not deploy the other services in this repository.

## Contract

- Service: `gateway`; project: `shared-gateway` (do not change the project name).
- Applications mount a **file** read-only under `/etc/caddy/sites-enabled/*.caddy`
  and attach `gateway` to their own external proxy network in a Compose override.
- Each application's internal service joins only its own proxy network, with a
  unique alias. Databases do not join proxy networks. Gateway has no Docker socket.
- An adapter must use an absolute bind source (via an environment variable): Compose
  resolves relative paths against the **first** Compose file, not the adapter.
- Adapters can `import access-log`; headers and query strings are omitted from both access and runtime/error logs.
  Never enable debug/request-header logging for production secrets.
- Application-specific environment names must not collide across adapters.

## Install and manage (Linux)

No server checkout/build is required. The **Package shared gateway** GitHub Actions
workflow produces `gateway-release-SHA` with only generic Compose/Caddy/docs and
checksums (or run `bash DevOps/gateway/package.sh NEW_OUTPUT` locally). Copy/extract
that artifact to a stable server directory such as `/srv/shared-gateway`, verify
`sha256sum --check checksums.sha256`, and keep the Caddyfile beside compose.yml.
The image is the official pinned Caddy image; the server only pulls/runs it.
Application site files/adapters arrive in their own repositories' release packages
and are installed at separate stable config paths. Initial DNS/credential/port
cutover is a one-time operator action, not a routine application deploy.

Use Docker Engine with Compose. Point application DNS A/AAAA records at this
server and allow TCP 80/443 in both the cloud and OS firewalls (UDP 443 optional).
Remove stale AAAA records. Use a reserved public IP. Keep Docker admin access private.

Each application guide supplies its network creation, `.env`, site file and adapter.
Use absolute paths, and keep the **same file list and env file** for every command:

```sh
# Add one -f /absolute/path/to/application-adapter.yml per application.
# The private env file supplies paths/hostnames requested by those adapters.
docker compose --env-file /srv/gateway.env \
  -f /srv/shared-gateway/compose.yml \
  -f /absolute/path/to/application-adapter.yml config --quiet
```

In the commands below, `<compose>` means that complete `docker compose ...` prefix.
Do not paste it literally. Do not omit adapters on subsequent `up` operations.

1. Before taking over public ports, validate without publishing ports or obtaining certificates:
   `<compose> run --rm --no-deps gateway caddy validate --config /etc/caddy/Caddyfile`.
2. Record the old ingress command and take the application's normal backups.
   Stop only the old public ingress and recreate its internal-only equivalent;
   do not stop databases/workers or delete volumes to change routing.
3. `<compose> up -d --wait`. Caddy obtains/renews public certificates automatically.
   A short ingress outage is expected while port ownership changes.
4. Check each application's public HTTPS and authenticated flows. Gateway health
   only proves Caddy is serving, not that every upstream/database is healthy.

For an existing site change, validate first and reload **only on success**:

```sh
<compose> exec -T gateway caddy validate --config /etc/caddy/Caddyfile && \
<compose> exec -T gateway caddy reload --config /etc/caddy/Caddyfile
```

Caddy keeps the last running config if validation/reload fails. Correct invalid
files before restarting the container. Prefer editing mounted files in place;
atomic file replacement can leave an existing single-file bind mount on the old
inode, requiring container recreation. Adding/removing adapters or networks also
requires gateway recreation; ordinary application deploy/restart does not.

## Rollback and certificates

If cutover fails, stop the shared gateway (do not remove its volumes), restore the
previous application's ingress mode/command and verify its HTTPS health. The old
application's certificate volume must remain intact throughout the transition.
Keep the new gateway's `shared-gateway_caddy-data` and `shared-gateway_caddy-config`
volumes across releases; securely back them up. Never use `down -v` or volume prune.

The gateway's certificates renew independently of application deploys. Monitor
public TLS expiry, Caddy logs and host disk space. A single gateway/server remains
a shared failure point; this is deployment independence, not high availability.

## Checks

```sh
python -m unittest discover -s DevOps/gateway/tests -v
docker compose -f DevOps/gateway/compose.yml config --quiet
```

Container build/runtime, DNS, firewall and certificate issuance checks need a
running Docker daemon and the actual server/hostnames.
The native Caddy regression checks run when `caddy` is on PATH or `CADDY_BIN`
points to the pinned executable; otherwise they are explicitly skipped.
