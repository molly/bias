from flask import request
from flask_restful import Resource


class Wikipedia(Resource):
    def post(self):
        body = request.get_json()
        title = body["title"]
        print(title)