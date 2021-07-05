from bs4 import BeautifulSoup
from constants.misc import HEADERS
from constants.urls import WIKIPEDIA_URL
from constants.likely_not_primary_url import LIKELY_NOT_PRIMARY_URL
from urllib.parse import urlparse
import requests


def get_references(soup, section_name=None):
    """Find the references section."""
    section_name = section_name.replace(" ", "_") if section_name else "References"
    references_header = soup.find(
        lambda tag: tag.name == "h2" and tag.find("span", id=section_name)
    )
    if not references_header:
        return None
    references_list = references_header.find_next(["ol", "ul"])
    if not references_list:
        return None
    return references_list.find_all("li", recursive=False)


def filter_domains(domains):
    """If the possible domains list has more than one entry, filter out some domains
    that are likely not the primary domain (for example, archived versions of the link,
    DOI.org links, etc.)"""
    if len(domains) == 1:
        return domains
    filtered = []
    for anchor in domains:
        if anchor["domain"] not in LIKELY_NOT_PRIMARY_URL:
            filtered.append(anchor)
    return filtered if len(filtered) > 0 else domains


def parse_references(title, args):
    req = requests.get(WIKIPEDIA_URL + title, headers=HEADERS)
    html = req.text
    soup = BeautifulSoup(html, "html.parser")
    html_references = get_references(soup, args.get("references_section_name"))
    if not html_references:
        return None
    references = {}
    for ind, ref in enumerate(html_references):
        anchors = ref.find_all("a", class_="external")
        backlinks = ref.find("span", class_="mw-cite-backlink")
        num_backlinks = len(backlinks.find_all("a")) if backlinks else 0
        possible_domains = []
        for anchor in anchors:
            parsed = urlparse(anchor["href"])
            netloc = (
                parsed.netloc[4:] if parsed.netloc.startswith("www.") else parsed.netloc
            )
            possible_domains.append({"href": anchor["href"], "domain": netloc.lower()})
        references[ind] = {
            "id": ref.id,
            "full": str(ref),
            "possible_domains": filter_domains(possible_domains),
            "usages": num_backlinks,
        }
    return references
