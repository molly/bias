from bs4 import BeautifulSoup
from constants.misc import HEADERS
from constants.urls import RSP_URL
import logging
import requests
import re
import json


def trim_href(href):
    return href[6:] if href.startswith("/wiki/") else href


def get_unique_source_name(source, sources):
    if source["name"] not in sources:
        return source["name"]
    elif source["parenthetical"]:
        source_with_parenthetical = "{} ({})".format(
            source["name"], source["parenthetical"]
        )
        if source_with_parenthetical not in sources:
            return source_with_parenthetical
    else:
        increment = 1
        while True:
            incremented = "{} [{}]".format(source["name"], increment)
            if incremented not in sources:
                break
            increment += 1
        return incremented


def parse_source(cell):
    sources = [
        {
            "name": None,
            "parenthetical": None,
            "link": None,
            "parent": None,
            "parent_link": None,
        }
    ]

    parent_source_link = cell.find("a")
    parent_source_name = parent_source_link.text if parent_source_link else None
    parent_source_match = re.match(r"\s*(.*?)(?:\s+$|$| ?(?:\(|WP:).*$)", cell.text)
    if parent_source_match:
        if not parent_source_name or parent_source_match.group(1) != parent_source_name:
            parent_source_name = parent_source_match.group(1)
    sources[0]["name"] = parent_source_name
    sources[0]["parent"] = parent_source_name
    if parent_source_link:
        trimmed = trim_href(parent_source_link["href"])
        sources[0]["link"] = trimmed
        sources[0]["parent_link"] = trimmed

    # Get any other sources included in this rating
    other_sources = []
    other_sources_span = cell.find(
        lambda tag: tag.name == "span"
        and "style" in tag.attrs
        and tag["style"].startswith("font-size")
    )
    if other_sources_span:
        for child in other_sources_span.children:
            if isinstance(child, str):
                if not re.match(r"^[\(\)\s,]+$", child):
                    entries = child.strip("()").split(", ")
                    filtered_entries = [
                        entry
                        for entry in entries
                        if not len(entry) == 0 or re.match(r"^[\(\)\s,]+$", entry)
                    ]
                    other_sources += filtered_entries
            elif child.name == "a":
                other_sources.append(child)
            else:
                link = child.find("a")
                if link:
                    other_sources.append(link)
                else:
                    other_sources.append(child.text)
    if any([isinstance(entry, str) and len(entry) < 5 for entry in other_sources]):
        print("check")

    # Get any parenthetical information
    parenthetical = None
    cell_text = cell.text
    if other_sources_span:
        cell_text = cell_text.replace(other_sources_span.text, "")
    cell_text = cell_text.replace(parent_source_name, "")
    cell_text_match = re.search(r"\(\s*(.*)\s*\)", cell_text)
    if cell_text_match:
        match = cell_text_match.group(1)
        if match and match != "UK":
            parenthetical = match

    sources[0]["parenthetical"] = parenthetical
    for source in other_sources:
        source_obj = {
            "parenthetical": parenthetical,
            "parent": parent_source_name,
            "parent_link": trim_href(parent_source_link["href"])
            if parent_source_link
            else None,
        }
        if isinstance(source, str):
            source_obj["name"] = source
        else:
            source_obj["name"] = source.text
            if "href" in source.attrs:
                source_obj["link"] = trim_href(source["href"])
        sources.append(source_obj)
    return sources


def parse(logger):
    req = requests.get(RSP_URL, headers=HEADERS)
    html = req.text
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", class_="perennial-sources")
    sources = {}
    if table:
        rows = table.find("tbody").find_all("tr")
        for row in rows:
            row_id = row["id"] if "id" in row.attrs else None
            cells = row.find_all("td")
            if len(cells) == 0:
                # Skip the header row
                continue
            source_info = parse_source(cells[0])
            ratings = [a["title"] for a in cells[1].find_all("a")]
            for source in source_info:
                uniq_source = get_unique_source_name(source, sources)
                source.update(
                    {
                        "ratings": ratings,
                        "row_id": row_id,
                    }
                )
                sources[uniq_source] = source
    return sources


def update(db, dry_run=False):
    dry_run = False  # TESTING

    logger = logging.getLogger("bias." + __name__)
    if dry_run:
        logger.info(
            "Wikipedia:Reliable sources/Perennial sources update complete (dry run)."
        )
    if not dry_run:
        sources = parse(logger)
        logger.info(
            "Wikipedia:Reliable sources/Perennial sources update complete. "
            "{} sources updated.".format(len(sources))
        )
