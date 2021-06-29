from bias.secrets import MONGO_URL
from bias.utils import omit
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
            [pymongo.ReplaceOne({"_id": source["_id"]}, source) for source in data]
        )

    def load(self, query):
        return self.database.sources.find(query)

    def set_last_updated(self, source, timestamp):
        self.database.metadata.update(
            {"source": source},
            {"$set": {"source": source, "last_updated": timestamp}},
            upsert=True,
        )
