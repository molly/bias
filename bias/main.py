from flask import Flask
from flask_restful import Api

from bias.update_data import update_if_stale

app = Flask(__name__)
api = Api(app)

if __name__ == "__main__":
    update_if_stale()
    # app.run()
