from bs4 import BeautifulSoup
from constants.misc import HEADERS
from constants.urls import WIKIPEDIA_URL
from unittest import TestCase
from wikipedia.parse import get_references
import os
import requests

LBRY = "LBRY"  # Uses standard referencing
MGTOW = "Men Going Their Own Way"  # Uses Harvard style referencing
PAGE_NAMES = [LBRY, MGTOW]

dirname = os.path.dirname(__file__)
data_path = os.path.join(dirname, "data")


class TestWikipediaParsing(TestCase):
    @classmethod
    def setUpClass(cls):
        if not os.path.exists(data_path):
            os.mkdir(data_path)
        files = os.listdir(data_path)
        for page in PAGE_NAMES:
            if not any(file.startswith(page) for file in files):
                with open(os.path.join(data_path, page + ".html"), "w") as html_file:
                    url = WIKIPEDIA_URL + page.replace(" ", "_")
                    req = requests.get(url, headers=HEADERS)
                    html_file.write(req.text)

    def test_get_references(self):
        for page in PAGE_NAMES:
            with open(os.path.join(data_path, page + ".html"), "r") as html_file:
                html = html_file.read()
            soup = BeautifulSoup(html, "html.parser")
            references = get_references(soup)
            self.assertGreater(len(references), 0)
