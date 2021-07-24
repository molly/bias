from database.database import Database
from constants.misc import UPDATE_FREQUENCY
from time import time
import logging
import sys
import threading

from sources.mbfc import update as mbfc_update

CONFIGS = [
    {
        "name": "Media Bias/Fact Check",
        "last_updated_db_key": "mbfc",
        "update_frequency": UPDATE_FREQUENCY["DAILY"],
        "update": mbfc_update,
    }
]


def start_update_thread(config, db, logger, debug=False, last_updated=None):
    log_message = ""
    if not last_updated:
        log_message = "No record of when {} was last updated. Updating now.".format(
            config["name"]
        )
    else:
        log_message = "{} was last updated {} seconds ago. Updating now.".format(
            config["name"], last_updated
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
            time_since_last_updated = time() - last_updated
            if time_since_last_updated > config["update_frequency"]:
                start_update_thread(config, db, logger, debug, last_updated)
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
