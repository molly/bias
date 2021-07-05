from flask import request, abort
from flask_restful import Resource
from wikipedia.process import process


class Wikipedia(Resource):
    def post(self):
        body = request.get_json()
        if "title" not in body:
            abort(400, "No article title")
        process(body)
