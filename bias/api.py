from flask import request
from flask_restful import Resource


class Bias(Resource):
    def get(self):
        body = request.get_json()
        return None
