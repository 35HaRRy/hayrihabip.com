import json
from dataclasses import dataclass
from typing import Any
from urllib import error, request

from fastapi import HTTPException

from services.notion import auth, constants


@dataclass(frozen=True)
class BookmarkRecord:
    id: int | float
    page_id: str
    data_source_id: str
    title: str
    group: str
    tags: list[str]
    url: str
    status_property_name: str | None
    status_type: str | None
    status_values: list[str]


def read_bookmark_records(limit: int = 15) -> list[BookmarkRecord]:
    notion_token = auth.get_notion_credentials()
    response = query_bookmarks_page(
        notion_token=notion_token,
        page_size=limit,
    )
    records: list[BookmarkRecord] = []

    for page in response.get("results", []):
        record = extract_bookmark_record(page)
        if record:
            records.append(record)

    return records[:limit]


def read_bookmarks_by_page_ids(page_ids: list[str]) -> list[BookmarkRecord]:
    notion_token = auth.get_notion_credentials()
    response = query_bookmarks_pages_by_ids(
        notion_token=notion_token,
        ids=page_ids
    )
    records: list[BookmarkRecord] = []

    for page in response.get("results", []):
        record = extract_bookmark_record(page)
        if record:
            records.append(record)

    return records


def group_bookmark_records(records: list[BookmarkRecord]) -> list[list[BookmarkRecord]]:
    groups = [
        records[index:index + 5]
        for index in range(0, min(len(records), 15), 5)
    ]

    valid_groups = [group for group in groups if len(group) >= 5]
    potcasted_groups: list[list[BookmarkRecord]] = []
    for group in valid_groups:
        try:
            for record in group:
                append_podcasted_status(record)
            potcasted_groups.append(group)
        except Exception:
            continue

    del groups
    del valid_groups

    return potcasted_groups


def query_bookmarks_page(
    notion_token: str,
    start_cursor: str | None = None,
    page_size: int = 15,
) -> dict[str, Any]:
    data_source_id = constants.DEFAULT_BOOKMARKS_DATA_SOURCE_ID
    payload: dict[str, Any] = {
        "page_size": page_size,
        "filter": {
            "or": [
                {
                    "property": "Status",
                    "select": {
                        "is_empty": True,
                    },
                },
                {
                    "and": [
                        {
                            "property": "Status",
                            "select": {
                                "does_not_equal": "Podcasted",
                            },
                        },
                        {
                            "property": "Tags",
                            "multi_select": {
                                "contains": "News",
                            },
                        },
                    ]
                }
            ],
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


def query_bookmarks_pages_by_ids(
    notion_token: str,
    start_cursor: str | None = None,
    ids: list[str] = [],
) -> dict[str, Any]:
    data_source_id = constants.DEFAULT_BOOKMARKS_DATA_SOURCE_ID
    payload: dict[str, Any] = {
        "filter": {
            "or":
            [
                {
                    "property": "ID",
                    "unique_id": {
                        "equals": int(id),
                    },
                }
            ]
            for id in ids
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


def read_bookmark_page(
    notion_token: str,
    page_id: str,
) -> dict[str, Any] | None:
    req = request.Request(
        url=f"https://api.notion.com/v1/pages/{page_id}",
        method="GET",
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
        if exc.code == 404:
            return None

        details = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(
            status_code=exc.code,
            detail=f"Notion API page request failed: {details}",
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
            bookmark_summary = prop.get("url")
            if isinstance(bookmark_summary, str) and bookmark_summary.strip():
                return bookmark_summary.strip()

    return None


def extract_bookmark_record(page: dict[str, Any]) -> BookmarkRecord | None:
    page_id = page.get("id")
    if not isinstance(page_id, str) or not page_id.strip():
        return None

    url = extract_url_from_page(page)
    if not url:
        return None

    properties = page.get("properties", {})

    id = properties.get("ID").get("unique_id").get("number")
    title = extract_title_property(properties)
    group = extract_rich_text_value(properties, ("Group", "userDefined:Group"))
    tags = extract_multi_select_values(properties, ("Tags", "userDefined:Tags"))
    status_property_name, status_property = extract_named_property(
        properties,
        ("Status", "userDefined:Status"),
    )
    status_type, status_values = extract_status_values(status_property)

    parent = page.get("parent", {})
    page_data_source_id = parent.get("data_source_id")
    if not isinstance(page_data_source_id, str) or not page_data_source_id.strip():
        page_data_source_id = constants.DEFAULT_BOOKMARKS_DATA_SOURCE_ID

    return BookmarkRecord(
        id=id,
        page_id=page_id,
        data_source_id=page_data_source_id,
        title=title,
        group=group,
        tags=tags,
        url=url,
        status_property_name=status_property_name,
        status_type=status_type,
        status_values=status_values,
    )


def append_podcasted_status(record: BookmarkRecord) -> None:
    notion_token = auth.get_notion_credentials()
    status_payload = build_status_update_payload(record)

    if status_payload is None:
        raise HTTPException(
            status_code=400,
            detail="Bookmark status property is missing or unsupported.",
        )

    req = request.Request(
        url=f"https://api.notion.com/v1/pages/{record.page_id}",
        data=json.dumps(
            {"properties": {record.status_property_name: status_payload}}
        ).encode("utf-8"),
        method="PATCH",
        headers={
            "Authorization": f"Bearer {notion_token}",
            "Content-Type": "application/json",
            "Notion-Version": constants.NOTION_API_VERSION,
        },
    )

    try:
        with request.urlopen(req, timeout=30) as response:
            response.read()
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(
            status_code=exc.code,
            detail=f"Notion API status update failed: {details}",
        ) from exc
    except error.URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to reach Notion API: {exc.reason}",
        ) from exc


def parse_bookmark_ids(ids: str) -> list[str]:
    page_ids = list(
        dict.fromkeys(
            part.strip()
            for part in ids.split(",")
            if part.strip()
        )
    )

    if not page_ids:
        raise HTTPException(status_code=400, detail="Query parameter 'ids' must contain at least one id.")

    return page_ids


def build_status_update_payload(record: BookmarkRecord) -> dict[str, Any] | None:
    if record.status_type == "multi_select":
        names = list(dict.fromkeys([*record.status_values, "Podcasted"]))
        return {
            "multi_select": [{"name": name} for name in names],
        }

    if record.status_type == "select":
        return {
            "select": {"name": "Podcasted"},
        }

    return None


def extract_property(
    properties: dict[str, Any],
    property_names: tuple[str, ...],
) -> dict[str, Any] | None:
    _, prop = extract_named_property(properties, property_names)
    return prop


def extract_named_property(
    properties: dict[str, Any],
    property_names: tuple[str, ...],
) -> tuple[str | None, dict[str, Any] | None]:
    for property_name in property_names:
        prop = properties.get(property_name)
        if isinstance(prop, dict):
            return property_name, prop

    return None, None


def extract_title_property(properties: dict[str, Any]) -> str:
    for property_name in ("Name", "Title", "title", "userDefined:Name"):
        prop = extract_property(properties, (property_name,))
        if not prop:
            continue

        title_items = prop.get("title")
        if isinstance(title_items, list):
            value = "".join(
                item.get("plain_text", "")
                for item in title_items
                if isinstance(item, dict)
            ).strip()
            if value:
                return value

    return ""


def extract_rich_text_value(
    properties: dict[str, Any],
    property_names: tuple[str, ...],
) -> str:
    prop = extract_property(properties, property_names)
    if not prop:
        return ""

    rich_text_items = prop.get("rich_text")
    if isinstance(rich_text_items, list):
        value = "".join(
            item.get("plain_text", "")
            for item in rich_text_items
            if isinstance(item, dict)
        ).strip()
        if value:
            return value

    select_value = prop.get("select")
    if isinstance(select_value, dict):
        name = select_value.get("name")
        if isinstance(name, str):
            return name.strip()

    return ""


def extract_multi_select_values(
    properties: dict[str, Any],
    property_names: tuple[str, ...],
) -> list[str]:
    prop = extract_property(properties, property_names)
    if not prop:
        return []

    items = prop.get("multi_select")
    if not isinstance(items, list):
        return []

    values: list[str] = []
    for item in items:
        if not isinstance(item, dict):
            continue

        name = item.get("name")
        if isinstance(name, str) and name.strip():
            values.append(name.strip())

    return values


def extract_status_values(prop: dict[str, Any] | None) -> tuple[str | None, list[str]]:
    if not prop:
        return None, []

    prop_type = prop.get("type")
    if prop_type == "multi_select":
        return "multi_select", extract_multi_select_values({"status": prop}, ("status",))

    if prop_type == "select":
        select_value = prop.get("select")
        if isinstance(select_value, dict):
            name = select_value.get("name")
            if isinstance(name, str) and name.strip():
                return "select", [name.strip()]
        return "select", []

    return None, []
