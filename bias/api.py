from bias.database.database import Database
from flask import request
from flask_restful import Resource


class Bias(Resource):
    def get(self):
        body = request.get_json()
        db = Database()
        results = []
        if "urls" in body:
            results += db.find_by_url(body["urls"])
        if "names" in body:
            results += db.find_by_name(body["names"])
        return results
