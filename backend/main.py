from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from api.sources import Sources
from api.wiki import Wikipedia

app = Flask(__name__)
CORS(app)
api = Api(app)
api.add_resource(Sources, "/")
api.add_resource(Wikipedia, '/evaluate')

if __name__ == "__main__":
    app.run(debug=True)
