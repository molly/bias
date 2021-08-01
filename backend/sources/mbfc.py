from constants.misc import HEADERS
from constants.urls import MBFC_API_URL
from database.mbfc_source import validate_mbfc_source
from utils import get_current_timestamp
import logging
import requests


def update(db, dry_run=False):
    """Update the MBFC sources file from their API."""
    logger = logging.getLogger("bias." + __name__)

    if dry_run:
        logger.info("Media Bias/Fact Check update complete (dry run).")
    if not dry_run:
        try:
            req = requests.get(MBFC_API_URL, headers=HEADERS, timeout=10)
            sources = req.json()["sources"]
            timestamp = get_current_timestamp()
        except requests.exceptions.Timeout:
            # This is a pretty slow endpoint, so it may time out. If it does, just try
            # again next time; no need for fancier error handling.
            logger.error("Media Bias/Fact Check endpoint timed out. No updates made.")
            return

        try:
            db.add_or_update_sources(
                [validate_mbfc_source(source, timestamp) for source in sources]
            )
            db.set_last_updated("mbfc", timestamp)
            logger.info(
                "Media Bias/Fact Check update complete. {} sources updated.".format(
                    len(sources)
                )
            )
        except Exception as e:
            logger.exception()
