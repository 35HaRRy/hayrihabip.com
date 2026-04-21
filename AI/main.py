from dotenv import load_dotenv
from fastapi import FastAPI, Query, Request, Response
from fastapi.responses import StreamingResponse

from AI.tools.helpers import validate_responses
from services.rss import feed
from services.notion import bookmark
from services import tts

load_dotenv()
app = FastAPI()


@app.get("/bookmarks/audio")
async def read_selected_bookmarks(ids: str = Query(...)):
    records = bookmark.read_bookmarks_by_ids(ids)
    urls, headers = validate_responses.selected_bookmarks(records)
    audio_stream = tts.build_audio_stream(urls)

    headers = {"Content-Disposition": 'inline; filename="bookmarks.mp3"'}
    return StreamingResponse(
        audio_stream,
        media_type="audio/mpeg",
        headers=headers,
    )


@app.head("/bookmarks/audio")
async def head_selected_bookmarks(ids: str = Query(...)):
    records = bookmark.read_bookmarks_by_ids(ids)
    _, headers = validate_responses.selected_bookmarks(records)

    return Response(status_code=200, media_type="audio/mpeg", headers=headers)


@app.get("/bookmarks/content")
async def read_selected_bookmarks_content(ids: str = Query(...)):
    records = bookmark.read_bookmarks_by_ids(ids)
    urls, _ = validate_responses.selected_bookmarks(records)
    content = tts.export_urls_to_markdown(urls)

    return Response(status_code=200, content=content, media_type="text/markdown")


@app.get("/bookmarks/rss")
async def bookmarks_rss(request: Request):
    channel_link = str(request.base_url).rstrip("/")

    records = bookmark.read_bookmark_records(limit=15)
    podcasted_groups = bookmark.group_bookmark_records(records)

    feed_options = feed.get_feed(podcasted_groups, channel_link)

    xml_content = feed.build_xml(
        channel_title=feed_options.title,
        channel_link=feed_options.channel_link,
        channel_description=feed_options.channel_description,
        items=feed_options.items,
    )
    return Response(content=xml_content, media_type="application/rss+xml")
