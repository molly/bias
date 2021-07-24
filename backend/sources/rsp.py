from bs4 import BeautifulSoup
from constants.misc import HEADERS
from constants.urls import RSP_URL
import logging
import requests
import re


def get_unique_source_name(source, source_info, sources):
    if source not in sources:
        return source
    elif source_info["parenthetical"]:
        source_with_parenthetical = "{} ({})".format(
            source, source_info["parenthetical"]
        )
        if source_with_parenthetical not in sources:
            return source_with_parenthetical
    else:
        increment = 1
        while True:
            incremented = "{} [{}]".format(source, increment)
            if incremented not in sources:
                break
            increment += 1
        return incremented


def parse_source(cell):
    source = {"name": None, "other_names": [], "parenthetical": None}
    source_link = cell.find("a")
    # Fall back to regex if there's no linked source
    source_match = re.match(r"\s*(.*?)(?:\s+$|$| ?(?:\(|WP:).*$)", cell.text)
    if source_match:
        source["name"] = source_match.group(1)

    # Get any other sources included in this rating
    other_sources = cell.find(
        lambda tag: tag.name == "span"
        and "style" in tag.attrs
        and tag["style"].startswith("font-size")
    )
    if other_sources:
        source["other_names"] = other_sources.text.strip("()").split(", ")

    # Get any parenthetical information
    cell_text = cell.text
    if other_sources:
        cell_text = cell_text.replace(other_sources.text, "")
    cell_text = cell_text.replace(source["name"], "")
    cell_text_match = re.search(r"\(\s*(.*)\s*\)", cell_text)
    if cell_text_match:
        match = cell_text_match.group(1)
        if match and match != "UK":
            source["parenthetical"] = match
    return source


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
            for source in [source_info["name"], *source_info["other_names"]]:
                uniq_source = get_unique_source_name(source, source_info, sources)
                sources[uniq_source] = {
                    "name": source,
                    "ratings": ratings,
                    "parenthetical": source_info["parenthetical"],
                    "parent": source_info["name"],
                    "row_id": row_id,
                }
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
