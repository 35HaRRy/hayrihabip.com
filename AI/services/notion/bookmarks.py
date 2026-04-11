import json
from typing import Any
from urllib import error, request

from fastapi import HTTPException

from services.notion import auth, constants


def read_bookmarks():
    notion_token = auth.get_notion_credentials()
    urls: list[str] = []
    start_cursor: str | None = None

    while True:
        response = query_bookmarks_page(
            notion_token=notion_token,
            start_cursor=start_cursor,
        )

        for page in response.get("results", []):
            url_value = extract_url_from_page(page)
            if url_value:
                urls.append(url_value)

        if not response.get("has_more"):
            break

        start_cursor = response.get("next_cursor")
        if not start_cursor:
            break

    return urls


def query_bookmarks_page(
    notion_token: str,
    start_cursor: str | None = None,
) -> dict[str, Any]:
    data_source_id = constants.DEFAULT_BOOKMARKS_DATA_SOURCE_ID
    payload: dict[str, Any] = {
        "page_size": 5,
        "filter": {
            "or": [
                {
                    "property": "Status",
                    "select": {
                        "is_empty": True,
                    },
                },
                {
                    "property": "Status",
                    "select": {
                        "equals": "Okumadım",
                    },
                },
            ]
        },
    }

    if start_cursor:
        payload["start_cursor"] = start_cursor

    req = request.Request(
        url=f"https://api.notion.com/v1/data_sources/{data_source_id}/query",
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {notion_token}",
            "Content-Type": "application/json",
            "Notion-Version": constants.NOTION_API_VERSION,
        },
    )

    try:
        with request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(
            status_code=exc.code,
            detail=f"Notion API request failed: {details}",
        ) from exc
    except error.URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to reach Notion API: {exc.reason}",
        ) from exc


def extract_url_from_page(page: dict[str, Any]) -> str | None:
    properties = page.get("properties", {})

    for property_name in ("URL", "userDefined:URL"):
        prop = properties.get(property_name)
        if isinstance(prop, dict):
            url_value = prop.get("url")
            if isinstance(url_value, str) and url_value.strip():
                return url_value.strip()

    return None
