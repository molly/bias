from database.database import Database
from flask import request
from flask_restful import Resource


class Sources(Resource):
    def post(self):
        body = request.get_json()
        db = Database()
        results = []
        if "domain" in body:
            results += db.find_by_url(body["domain"])
        if "title" in body:
            results += db.find_by_name(body["title"])
        return results
