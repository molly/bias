from time import time


def omit(d, *keys):
    """Return a copy of this dict with specified keys omitted."""
    return {k: v for k, v in d.items() if k not in keys}


def get_current_timestamp():
    """Get the current time in seconds."""
    return int(time())
