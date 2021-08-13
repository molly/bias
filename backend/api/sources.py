from database.database import Database
from flask import request
from flask_restful import Resource
import re


class Sources(Resource):
    def post(self):
        body = request.get_json()
        db = Database()
        results = []
        if "domain" in body:
            results += db.find_by_domain(body["domain"])
        if "name" in body:
            name = body["name"].lower()
            stripped = re.sub(r"^the ", "", name, re.IGNORECASE)
            print(stripped)
            results += db.find_by_name(stripped)
        return results
