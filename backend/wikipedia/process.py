from database.database import Database
from wikipedia.parse import parse_references
from utils import omit


def get_source_info(domains):
    sources = {}
    db = Database()
    sources_cursor = db.find_by_domain(list(domains))
    for source in sources_cursor:
        sources[source["source_url"]] = source
    return sources


def process(args):
    title = args.pop("title")
    references = parse_references(title, args)
    source_info = get_source_info(references["domains"])
    total_usages = 0
    domain_usages = {"unknown": {"citations": 0, "usages": 0}}

    for key, cite in references["citations"].items():
        references["citations"][key]["evaluations"] = {}
        total_usages += references["citations"][key]["usages"]

        # Find evaluation for this source
        evaluation = None
        for domain in cite["possible_domains"]:
            if domain in source_info:
                evaluation = source_info[domain]
                continue

        if evaluation:
            # Add to result
            references["citations"][key]["evaluations"][
                evaluation["rater"]
            ] = evaluation

            # Calculate domain usage
            domain = evaluation["source_url"]
            references["citations"][key]["evaluations"][
                evaluation["rater"]
            ] = evaluation
            if domain in domain_usages:
                domain_usages[domain]["citations"] += 1
                domain_usages[domain]["usages"] += references["citations"][key][
                    "usages"
                ]
            else:
                domain_usages[domain] = {
                    "citations": 1,
                    "usages": references["citations"][key]["usages"],
                }
        else:
            domain_usages["unknown"]["citations"] += 1
            domain_usages["unknown"]["usages"] += references["citations"][key]["usages"]

    return {
        **omit(references, "domains"),
        "domain_usages": domain_usages,
        "total": len(references["citations"]),
        "total_usages": total_usages,
    }
