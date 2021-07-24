from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from api.sources import Sources
from api.wiki import Wikipedia

from sources.update import update_stale

import logging
import os
import sys

app = Flask(__name__)
CORS(app)
api = Api(app)
api.add_resource(Sources, "/")
api.add_resource(Wikipedia, "/evaluate")


def setup_logging(debug=False):
    logger = logging.getLogger("bias")
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%m/%d/%Y %I:%M:%S %p",
    )

    if debug:
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        ch.setFormatter(formatter)
        logger.addHandler(ch)
    else:
        if not os.path.exists("logs"):
            os.mkdir("logs")
        fh = logging.FileHandler("logs/bias.log", encoding="utf-8")
        fh.setLevel(logging.DEBUG)
        fh.setFormatter(formatter)
        logger.addHandler(fh)


if __name__ == "__main__":
    is_debug = sys.argv[1] == "debug"
    setup_logging(is_debug)
    update_stale(is_debug)
    # app.run(debug=is_debug)
