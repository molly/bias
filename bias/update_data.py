from bias.constants.misc import HEADERS
from time import time
import json
import requests
import threading

MBFC_API_URL = "http://mbfcapi.herokuapp.com/api/v1/sources"
SECONDS_IN_A_DAY = 86400


def update():
    """Update the MBFC sources file from their API."""
    try:
        req = requests.get(
            "http://mbfcapi.herokuapp.com/api/v1/sources", headers=HEADERS, timeout=10
        )
        with open("data/mbfc-sources.json", "wb") as mbfc_file:
            mbfc_file.write(req.content)
        with open("data/metadata.json", "w") as metadata_file:
            json.dump({"mbfc": time()}, metadata_file)
    except requests.exceptions.Timeout:
        # This is a pretty slow endpoint, so it may time out. If it does, just try
        # again next time; no need for fancier error handling.
        pass


def needs_update():
    """Determine if the MBFC sources file needs updating. I'm considering a file older
    than a day to be outdated."""
    try:
        with open("data/metadata.json", "r", encoding="utf-8") as json_file:
            metadata = json.load(json_file)
        mbfc_last_updated = metadata["mbfc"]
        time_since_last_updated = time() - mbfc_last_updated
        return time_since_last_updated > SECONDS_IN_A_DAY
    except (json.JSONDecodeError, FileNotFoundError) as e:
        return True


def update_if_stale():
    if needs_update():
        thread = threading.Thread(target=update)
        thread.start()
