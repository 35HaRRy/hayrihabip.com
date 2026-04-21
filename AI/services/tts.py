from collections.abc import AsyncIterator

from trafilatura import fetch_url, extract
from trafilatura.settings import Extractor
from trafilatura.downloads import add_to_compressed_dict
from trafilatura.downloads import buffered_downloads, load_download_buffer

import edge_tts
import base64


async def text_to_speech(text: str) -> AsyncIterator[bytes]:
    communicate = edge_tts.Communicate(text, "tr-TR-AhmetNeural")
    async for chunk in communicate.stream():
        if chunk.get("type") != "audio":
            continue
        data = chunk.get("data")
        if isinstance(data, bytes):
            yield data
            continue
        if isinstance(data, str):
            try:
                yield base64.b64decode(data)
            except Exception:
                continue


def build_audio_stream(urls: list[str]) -> AsyncIterator[bytes]:
    content_parts: list[str] = []

    for url in urls:
        new_content = export_url_to_markdown(url)
        if new_content:
            content_parts.append(new_content)

    content = "\n\n".join(content_parts)
    audio_stream = text_to_speech(content)

    return audio_stream


def export_url_to_markdown(url: str) -> str | None:
    document = fetch_url(url)
    markdown = extract(document, output_format='markdown')

    return markdown


def export_urls_to_markdown(urls: list[str]) -> str:
    content_parts: list[str] = []

    for url in urls:
        new_content = export_url_to_markdown(url)
        if new_content:
            content_parts.append(new_content)

    content = "\n\n".join(content_parts)
    return content


def export_urls_to_markdown_bulk(urls: list[str]) -> list[dict[str, str]]:
    content: list[dict[str, str]] = []
    threads = 4
    options = Extractor()
    options.format = "markdown"

    url_store = add_to_compressed_dict(urls)
    while url_store.done is False:
        buffer_list, url_store = load_download_buffer(url_store, sleep_time=5)
        for url, result in buffered_downloads(buffer_list, threads, options):
            content.append({"url": url, "content": result})

    return content
