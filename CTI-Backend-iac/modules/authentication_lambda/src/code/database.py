from pymongo import MongoClient
from datetime import datetime


class DocumentDb:
    def __init__(self, connection_string: str, db_name: str, collection_name: str):
        self.__client = MongoClient(connection_string)
        self.__db = self.__client.get_database(name=db_name)
        self.__collection_name = collection_name

    def get_refresh_token_document_by_id(self, id: str):
        collections_cursor = self.__db.get_collection(self.__collection_name).find({"id": id})
        collection_size = len(list(collections_cursor.clone()))
        if collection_size > 1:
            raise ValueError(
                f"The id: {id} is present twice in {self.__collection_name} which is an illegal state.")
        elif collection_size == 0:
            return None
        else:
            return collections_cursor.next()

    def update_refresh_token_by_id(self, id: str, refresh_token: str, expiration_time: datetime):
        id_to_find = {"id": id}
        new_refresh_token_to_set = {"$set": {"refresh_token": refresh_token, "expiration_time": expiration_time}}
        self.__db.get_collection(self.__collection_name).update_one(id_to_find, new_refresh_token_to_set, upsert=True)
