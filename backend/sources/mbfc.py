from constants.misc import HEADERS, SECONDS_IN_A_DAY
from constants.urls import MBFC_API_URL
from database.database import Database
from database.mbfc_source import validate_mbfc_source
from time import time
import json
import requests
import threading


def update(db):
    """Update the MBFC sources file from their API."""
    try:
        req = requests.get(
            "http://mbfcapi.herokuapp.com/api/v1/sources", headers=HEADERS, timeout=10
        )
        sources = req.json()["sources"]
        timestamp = int(time() * 1000)
        db.set_last_updated("mbfc", timestamp)
        db.add_or_update_sources(
            [validate_mbfc_source(source, timestamp) for source in sources]
        )
    except requests.exceptions.Timeout:
        # This is a pretty slow endpoint, so it may time out. If it does, just try
        # again next time; no need for fancier error handling.
        pass


def needs_update(db):
    """Determine if the MBFC sources file needs updating. I'm considering a file older
    than a day to be outdated."""
    mbfc_last_updated = db.get_last_updated("mbfc")
    if mbfc_last_updated:
        time_since_last_updated = time() - mbfc_last_updated
        return time_since_last_updated > SECONDS_IN_A_DAY
    return True


def update_mbfc_if_stale():
    db = Database()
    if needs_update(db):
        thread = threading.Thread(target=update, args=(db,))
        thread.start()
