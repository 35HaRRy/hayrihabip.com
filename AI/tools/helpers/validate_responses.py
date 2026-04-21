from fastapi import HTTPException


def selected_bookmarks(records) -> tuple[list[str], dict[str, str]]:
    if not records:
        raise HTTPException(status_code=404, detail="No bookmarks found for the given ids.")

    urls = [record.url for record in records if record.url]
    if not urls:
        raise HTTPException(status_code=404, detail="No bookmark URLs found for the given ids.")

    return urls, {"Content-Disposition": 'inline; filename="bookmarks.mp3"'}
