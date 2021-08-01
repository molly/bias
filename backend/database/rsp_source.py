from constants.sources.rsp import ACCURACY
from time import time


class Source:
    def __init__(
        self,
        name: str,
        display_name: str,
        source_url: str,
        accuracy_str: str,
        accuracy: float,
        rater: str,
        rater_url: str,
        parent_rating: str,
        last_updated: int = None,
        _id: str = None,
        **kwargs
    ):
        self.name = name
        self.display_name = display_name
        self.source_url = source_url
        self.accuracy_str = accuracy_str
        self.accuracy = accuracy
        self.rater = rater
        self.rater_url = rater_url
        self.parent_rating = parent_rating
        self.last_updated = last_updated or int(time() * 1000)
        self._id = _id or name + "_" + rater

    @staticmethod
    def get_accuracy_string(ratings):
        if len(ratings) == 1:
            return ratings[0]
        else:
            accuracy_string = ", ".join([rating.lower() for rating in ratings])
            return accuracy_string.capitalize()

    @staticmethod
    def get_accuracy_value(ratings):
        values = [ACCURACY.get(rating.lower()) for rating in ratings]
        values = [val for val in values if val is not None]
        return min(values)

    @classmethod
    def from_rsp(cls, data, timestamp=None):
        return cls(
            name=data["name"],
            display_name="{} ({})".format(data["name"], data["parenthetical"])
            if data["parenthetical"]
            else data["name"],
            source_url=data.get("domain"),
            accuracy_str=cls.get_accuracy_string(data["ratings"]),
            accuracy=cls.get_accuracy_value(data["ratings"]),
            rater="rsp",
            rater_url="https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources/Perennial_sources#Sources",
            parent_rating=data.get("parent"),
            last_updated=timestamp,
        )

    def as_dict(self):
        d = {
            "name": self.name,
            "display_name": self.display_name,
            "source_url": self.source_url,
            "accuracy": self.accuracy,
            "accuracy_str": self.accuracy_str,
            "rater": self.rater,
            "rater_url": self.rater_url,
            "last_updated": self.last_updated,
            "_id": self._id,
        }
        return d


def validate_rsp_source(data, timestamp=None):
    source = Source.from_rsp(data, timestamp)
    return source.as_dict()
