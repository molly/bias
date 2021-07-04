from bs4 import BeautifulSoup
from constants.misc import HEADERS
from constants.urls import WIKIPEDIA_URL
import requests


def get_references(soup):
    references_header = soup.find(
        lambda tag: tag.name == "h2" and tag.find("span", id="References")
    )
    references_list = references_header.find_next(["ol", "ul"])
    return references_list.find_all("li")


def evaluate(title):
    # req = requests.get(WIKIPEDIA_URL + title, headers=HEADERS)
    # html = req.text
    with open("tmp.html", "r") as html_file:
        html = html_file.read()
    soup = BeautifulSoup(html, "html.parser")
    references = get_references(soup)
    print(len(references))


if __name__ == "__main__":
    # Temporary, just for testing
    title = "Dinesh_D%27Souza"
    evaluate(title)
