from wikipedia.parse import parse_references


def process(args):
    title = args.pop("title")
    references = parse_references(title, args)
