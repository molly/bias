from bs4 import BeautifulSoup
from constants.misc import HEADERS
from constants.urls import WIKIPEDIA_URL
from constants.likely_not_primary_url import LIKELY_NOT_PRIMARY_URL
from tld import get_fld
from urllib.parse import urlparse
from wikipedia.ProcessingException import ProcessingException
import requests


def get_references(soup, section_name=None):
    """Find the references section."""
    section_name = section_name or "References"
    wt_section_name = section_name.replace(" ", "_")
    references_header = soup.find(
        lambda tag: tag.name == "h2" and tag.find("span", id=wt_section_name)
    )
    if not references_header:
        raise ProcessingException(
            "Couldn't find a references section named \"" + section_name + '".'
        )
    references_list = references_header.find_next(["ol", "ul"])
    if not references_list:
        raise ProcessingException(
            "Couldn't find the references list within the section named \""
            + section_name
            + '".'
        )
        return None
    return references_list.find_all("li", recursive=False)


def filter_domains(domains):
    """If the possible domains list has more than one entry, filter out some domains
    that are likely not the primary domain (for example, archived versions of the link,
    DOI.org links, etc.)"""
    if len(domains) == 1:
        return domains
    filtered = []
    for domain in domains:
        if domain not in LIKELY_NOT_PRIMARY_URL:
            filtered.append(domain)
    return filtered if len(filtered) > 0 else domains


def get_additional_possibilities_for_domain(domain):
    fld = get_fld(domain, fix_protocol=True)
    if fld != domain:
        return fld
    return None


def get_domain_possibilities(anchors):
    raw_domains_list = []

    # First just get all of the domains
    for anchor in anchors:
        parsed = urlparse(anchor["href"])
        netloc = (
            parsed.netloc[4:] if parsed.netloc.startswith("www.") else parsed.netloc
        )
        netloc = netloc.lower()
        raw_domains_list.append(netloc)

    # Filter out likely red herrings (archive.org, etc.)
    domain_possibilities = set(filter_domains(raw_domains_list))

    # Get additional possibilities (for example, for "subdomain.foo.com", get "foo.com")
    additional_possibilities = set()
    for domain in domain_possibilities:
        additional_possibility = get_additional_possibilities_for_domain(domain)
        if additional_possibility:
            additional_possibilities.add(additional_possibility)

    return domain_possibilities.union(additional_possibilities)


def parse_references(title, args):
    url = WIKIPEDIA_URL + title
    req = requests.get(url, headers=HEADERS)
    html = req.text
    soup = BeautifulSoup(html, "html.parser")

    # Check that an article exists
    if soup.find(class_="noarticletext"):
        raise ProcessingException('There is no article titled "' + title + '".')

    # Parse references
    html_references = get_references(soup, args.get("references_section_name"))
    references = {"domains": set(), "citations": dict(), "url": url}
    for ind, ref in enumerate(html_references):
        # Calculate usages
        backlinks = ref.find("span", class_="mw-cite-backlink")
        num_backlinks = len(backlinks.find_all("a")) if backlinks else 0

        # Find domains
        anchors = ref.find_all("a", class_="external")
        possible_domains = get_domain_possibilities(anchors)
        references["domains"].update(possible_domains)

        # Get text-only representation of this reference
        ref_text = ref.find(class_="reference-text")
        if ref_text is None:
            ref_text = ref

        # Add result to citations dict
        references["citations"][ind] = {
            "id": ref.get("id"),
            "text": ref_text.text,
            "possible_domains": list(possible_domains),
            "usages": num_backlinks,
        }
    return references
