from database.database import Database
from constants.misc import UPDATE_FREQUENCY, SECONDS_IN_A_DAY
from utils import get_current_timestamp
import logging
import sys
import threading

from sources.mbfc import update as mbfc_update
from sources.rsp import update as rsp_update

CONFIGS = [
    {
        "name": "Media Bias/Fact Check",
        "last_updated_db_key": "mbfc",
        "update_frequency": UPDATE_FREQUENCY["DAILY"],
        "update": mbfc_update,
    },
    {
        "name": "Wikipedia:Reliable sources/Perennial sources",
        "last_updated_db_key": "rsp",
        "update_frequency": UPDATE_FREQUENCY["WEEKLY"],
        "update": rsp_update,
    },
]


def start_update_thread(config, db, logger, debug=False, time_since_last_updated=None):
    if not time_since_last_updated:
        log_message = "No record of when {} was last updated. Updating now.".format(
            config["name"]
        )
    else:
        log_message = (
            "{} was last updated {} seconds ago ({} days). Updating now.".format(
                config["name"],
                time_since_last_updated,
                round(time_since_last_updated / SECONDS_IN_A_DAY, 2),
            )
        )
    logger.info(log_message)
    thread = threading.Thread(target=config["update"], args=(db, debug))
    thread.start()


def update_stale(debug=False):
    logger = logging.getLogger("bias." + __name__)
    db = Database()
    for config in CONFIGS:
        last_updated = db.get_last_updated(config["last_updated_db_key"])

        if last_updated:
            time_since_last_updated = get_current_timestamp() - last_updated
            if time_since_last_updated > config["update_frequency"]:
                start_update_thread(config, db, logger, debug, time_since_last_updated)
            else:
                logger.info(
                    "{} was last updated {} seconds ago. Not updating.".format(
                        config["name"], time_since_last_updated
                    )
                )
        else:
            start_update_thread(config, db, logger, debug)


if __name__ == "__main__":
    is_debug = sys.argv[1] == "debug"
    update_stale(is_debug)
