from datetime import datetime, timezone
from email.utils import format_datetime
from xml.etree import ElementTree as ET
import uuid

from services.notion.bookmark import BookmarkRecord
from services.rss import constants


class FeedOptions:
    title: str
    channel_link: str
    channel_description: str
    items: list[dict[str, str]]

    def __init__(self, title: str, channel_link: str, channel_description: str, items: list[dict[str, str]]) -> None:
        self.title = title
        self.channel_link = channel_link
        self.channel_description = channel_description
        self.items = items


def get_feed(podcasted_groups: list[list[BookmarkRecord]], channel_link: str) -> FeedOptions:
    feed_items: list[dict[str, str]] = []
    for group in podcasted_groups:
        ids = ",".join(str(record.id) for record in group)
        item_link = f"{channel_link}/bookmarks/audio?ids={ids}"
        title = " | ".join(
            record.title or record.url
            for record in group
        )
        description_lines = [
            (
                f"title: {record.title} | "
                f"group: {record.group} | "
                f"tags: {', '.join(record.tags)} | "
                f"url: {record.url}"
            )
            for record in group
        ]
        feed_items.append(
            {
                "guid": str(uuid.uuid4()),
                "title": title,
                "link": item_link,
                "description": "\n".join(description_lines),
                "type": "audio/mp3",
            }
        )
    return FeedOptions(
        title=constants.RSS_FEED_TITLE,
        channel_link=channel_link,
        channel_description=constants.RSS_FEED_DESCRIPTION,
        items=feed_items,
    )


def build_xml(
    channel_title: str,
    channel_link: str,
    channel_description: str,
    items: list[dict[str, str]],
) -> str:
    rss = ET.Element("rss", version="2.0")
    channel = ET.SubElement(rss, "channel")

    ET.SubElement(channel, "title").text = channel_title
    ET.SubElement(channel, "link").text = channel_link
    ET.SubElement(channel, "description").text = channel_description
    ET.SubElement(channel, "lastBuildDate").text = format_datetime(
        datetime.now(timezone.utc),
        usegmt=True,
    )

    for item in items:
        item_element = ET.SubElement(channel, "item")
        ET.SubElement(item_element, "title").text = item["title"]
        ET.SubElement(item_element, "link").text = item["link"]
        ET.SubElement(item_element, "description").text = item["description"]
        ET.SubElement(item_element, "type").text = item["type"]
        ET.SubElement(item_element, "guid").text = item["guid"]

    return ET.tostring(rss, encoding="utf-8", xml_declaration=True).decode("utf-8")
