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
    domains = {"unknown": {"citations": 0, "usages": 0}}

    for key, cite in references["citations"].items():
        references["citations"][key]["key"] = key
        evaluations = {}
        total_usages += references["citations"][key]["usages"]

        # Find evaluation for this source
        evaluation = None
        for domain in cite["possible_domains"]:
            if domain in source_info:
                evaluation = source_info[domain]
                continue

        if evaluation:
            # Add to result
            evaluations[evaluation["rater"]] = evaluation

            # Calculate domain usage
            domain = evaluation["source_url"]
            evaluations[evaluation["rater"]] = evaluation
            if domain in domains:
                domains[domain]["citations"] += 1
                domains[domain]["usages"] += references["citations"][key]["usages"]
            else:
                domains[domain] = {
                    "domain": domain,
                    "citations": 1,
                    "usages": references["citations"][key]["usages"],
                    "evaluations": evaluations,
                }
        else:
            domains["unknown"]["citations"] += 1
            domains["unknown"]["usages"] += references["citations"][key]["usages"]

        references["citations"][key]["evaluations"] = evaluations

    return {
        **omit(references, "domains"),
        "domains": domains,
        "total": len(references["citations"]),
        "total_usages": total_usages,
    }
