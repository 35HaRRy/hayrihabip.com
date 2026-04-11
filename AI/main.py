from dotenv import load_dotenv
from fastapi import FastAPI
# from fastapi.responses import StreamingResponse

# from services.notion import bookmarks
from services import tts

load_dotenv()
app = FastAPI()


@app.get("/bookmarks")
async def read_bookmarks():
    # urls = bookmarks.read_bookmarks()
    urls = [
        "https://www.minepla.net/2022/11/event-routing-with-amazon-eventbridge-aws/",
        "https://webrazzi.com/2026/04/10/instagram-yorum-duzenleme-ozelligini-kullanima-sundu/"
    ]
    content_parts: list[str] = []

    for url in urls:
        new_content = tts.export_url_to_markdown(url)
        if new_content:
            content_parts.append(new_content)

    # content = "\n\n".join(content_parts)
    # audio_stream = await tts.text_to_speech(content)

    # return StreamingResponse(
    #     audio_stream,
    #     media_type="audio/mpeg",
    #     headers={"Content-Disposition": 'inline; filename="bookmarks.mp3"'},
    # )
