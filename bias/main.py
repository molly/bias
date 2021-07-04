from flask import Flask
from flask_restful import Api

from bias.api import Bias

app = Flask(__name__)
api = Api(app)
api.add_resource(Bias, "/")

if __name__ == "__main__":
    # update_if_stale() TODO: Move this somewhere else to run periodically
    app.run(debug=True)
