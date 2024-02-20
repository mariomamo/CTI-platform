from pymongo import MongoClient
from datetime import datetime, timezone


class DocumentDb:
    def __init__(self, connection_string: str, db_name: str, collection_name: str):
        self.__client = MongoClient(connection_string)
        self.__db = self.__client.get_database(name=db_name)
        self.__collection_name = collection_name

    def insert_event(self, event: str, transaction_hash: str, block_hash: str,
                     block_number: int, log_index: int, transaction_index: int,
                     contract_address: str, event_values: dict):

        return self.__db.get_collection(self.__collection_name) \
            .insert_one({"event": event, "transaction_hash": transaction_hash, "block_hash": block_hash,
                         "block_number": block_number, "log_index": log_index, "transaction_index": transaction_index,
                         "contract_address": contract_address, "event_values": event_values, "timestamp": int(datetime.now(timezone.utc).timestamp())})

    def get_events(self, event: str):
        query = {"event": event}
        projection = {'_id': False}
        cursor = self.__db.get_collection(self.__collection_name).find(query, projection)

        return [doc for doc in cursor]
