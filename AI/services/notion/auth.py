import os

from fastapi import HTTPException


def get_notion_credentials() -> str:
    notion_token = os.getenv("NOTION_TOKEN") or os.getenv("NOTION_API_KEY")

    if not notion_token:
        raise HTTPException(
            status_code=500,
            detail="Set NOTION_TOKEN or NOTION_API_KEY.",
        )

    return notion_token
