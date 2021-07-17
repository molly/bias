from constants.sources.mbfc import BIAS, ACCURACY
from time import time


class Source:
    def __init__(
        self,
        name: str,
        display_name: str,
        source_url: str,
        bias_str: str,
        bias: float,
        accuracy_str: str,
        accuracy: float,
        rater: str,
        rater_url: str,
        last_updated: int = None,
        _id: str = None,
        **kwargs
    ):
        self.name = name
        self.display_name = display_name
        self.source_url = source_url
        self.bias_str = bias_str
        self.bias = bias
        self.accuracy_str = accuracy_str
        self.accuracy = accuracy
        self.rater = rater
        self.rater_url = rater_url
        self.last_updated = last_updated or int(time() * 1000)
        self._id = _id or name + "_" + rater

    @classmethod
    def from_mbfc(cls, data, timestamp=None):
        return cls(
            name=data["name"],
            display_name=data["display_name"],
            source_url=data["url"],
            bias_str=data["bias"],
            bias=BIAS.get(data["bias"]),
            accuracy_str=data["accuracy"],
            accuracy=ACCURACY.get(data["accuracy"]),
            rater="mbfc",
            rater_url=data["mbfc_url"],
            last_updated=timestamp,
        )

    def as_dict(self):
        d = {
            "name": self.name,
            "display_name": self.display_name,
            "source_url": self.source_url,
            "bias": self.bias,
            "bias_str": self.bias_str,
            "accuracy": self.accuracy,
            "accuracy_str": self.accuracy_str,
            "rater": self.rater,
            "rater_url": self.rater_url,
            "last_updated": self.last_updated,
            "_id": self._id,
        }
        return d


def validate_mbfc_source(data, timestamp=None):
    source = Source.from_mbfc(data, timestamp)
    return source.as_dict()
