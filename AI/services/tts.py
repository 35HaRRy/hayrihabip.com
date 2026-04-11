from trafilatura import fetch_url, extract
from trafilatura.settings import Extractor
from trafilatura.downloads import add_to_compressed_dict
from trafilatura.downloads import buffered_downloads, load_download_buffer

import edge_tts


async def text_to_speech(text: str):
    communicate = edge_tts.Communicate(text, "tr-TR-AhmetNeural")
    return communicate.stream()
    # async for chunk in communicate.stream():
    #     if chunk["type"] == "audio":
    #         yield chunk["data"]


def export_url_to_markdown(url: str) -> str | None:
    document = fetch_url(url)
    markdown = extract(document, output_format='markdown')

    return markdown


def export_urls_to_markdown(urls: list[str]) -> list[dict[str, str]]:
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
