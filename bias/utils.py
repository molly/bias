def omit(d, *keys):
    return {k: v for k, v in d.items() if k not in keys}
