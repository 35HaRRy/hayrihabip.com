from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.responses import StreamingResponse

from services.rss import feed
from services.notion import bookmark
from services import tts

load_dotenv()
app = FastAPI()


@app.get("/bookmarks/audio")
async def read_selected_bookmarks(ids: str = Query(...)):
    page_ids = bookmark.parse_bookmark_ids(ids)
    records = bookmark.read_bookmarks_by_page_ids(page_ids)

    if not records:
        raise HTTPException(status_code=404, detail="No bookmarks found for the given ids.")

    urls = [record.url for record in records if record.url]
    if not urls:
        raise HTTPException(status_code=404, detail="No bookmark URLs found for the given ids.")

    audio_stream = tts.build_audio_stream(urls)

    return StreamingResponse(
        audio_stream,
        media_type="audio/mpeg",
        headers={"Content-Disposition": 'inline; filename="bookmarks.mp3"'},
    )


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
