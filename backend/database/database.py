from _secrets import MONGO_URL
from utils import omit
from urllib.parse import urlparse
import pymongo


class Database:
    def __init__(self):
        client = pymongo.MongoClient(MONGO_URL)
        self.database = client.get_default_database()

    def add(self, data):
        self.database.sources.insert_one(data)

    def bulk_add(self, data):
        self.database.sources.insert_many(data)

    def update(self, data):
        self.database.sources.update_one(
            {"name": data["_id"]}, {"$set": omit(data, "_id")}, upsert=True
        )

    def bulk_update(self, data):
        self.database.sources.bulk_write(
            [
                pymongo.ReplaceOne({"_id": source["_id"]}, source, upsert=True)
                for source in data
            ]
        )

    def add_or_update_sources(self, data):
        if "sources" in self.database.list_collection_names():
            return self.bulk_update(data)
        else:
            return self.bulk_add(data)

    def get_last_updated(self, source):
        self.database.metadata.find_one({"source": source})

    def set_last_updated(self, source, timestamp):
        self.database.metadata.update(
            {"source": source},
            {"$set": {"source": source, "last_updated": timestamp}},
            upsert=True,
        )

    def find(self, query):
        return self.database.sources.find(query)

    def find_by_domain(self, domains):
        return self.find({"source_url": {"$in": domains}})

    def find_by_url(self, urls):
        domains = []
        for url in urls:
            netloc = urlparse(url).netloc
            domains.append(".".join(netloc.split(".")[1:]))
        return self.find_by_domain(domains)

    def find_by_name(self, names):
        normalized = [name.lower() for name in names]
        return self.find({"name": {"$in": normalized}})
