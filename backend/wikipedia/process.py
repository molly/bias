from database.database import Database
from wikipedia.parse import parse_references


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
    for key, cite in references["citations"].items():
        references["citations"][key]["evaluations"] = {}
        for domain in cite["possible_domains"]:
            if domain in source_info:
                evaluation = source_info[domain]
                references["citations"][key]["evaluations"][
                    evaluation["rater"]
                ] = evaluation
                continue
    return references["citations"]
