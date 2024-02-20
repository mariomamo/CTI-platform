from pymongo import MongoClient
import uuid


class DocumentDb:
    def __init__(self, connection_string: str, db_name: str, collection_name: str):
        self.__client = MongoClient(connection_string)
        self.__db = self.__client.get_database(name=db_name)
        self.__collection_name = collection_name

    def get_nonce_document_by_address(self, address: str):
        collections_cursor = self.__db.get_collection(self.__collection_name).find({"address": address})
        collection_size = len(list(collections_cursor.clone()))
        if collection_size > 1:
            raise ValueError(
                f"The address: {address} is present twice in {self.__collection_name} which is an illegal state.")
        elif collection_size == 0:
            return None
        else:
            return collections_cursor.next()

    def register_user(self, address: str, nonce: str):
        return self.__db.get_collection(self.__collection_name).insert_one({"address": address, "nonce": nonce})

    def update_nonce_by_address(self, address: str, new_nonce: str):
        address_to_find = {"address": address}
        new_nonce_to_set = {"$set": {"nonce": new_nonce}}
        self.__db.get_collection(self.__collection_name).update_one(address_to_find, new_nonce_to_set)
