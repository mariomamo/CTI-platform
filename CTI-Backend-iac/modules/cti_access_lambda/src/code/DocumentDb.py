import traceback

from pymongo import MongoClient


class DocumentDb:
    def __init__(self, connection_string: str, db_name: str, collection_name: str):
        self.__client = MongoClient(connection_string)
        self.__db = self.__client.get_database(name=db_name)
        self.__collection_name = collection_name

    def put_cti(self, cti: dict):
        query_filter = {
            "id": cti["id"]
        }
        update_query = {
            "$setOnInsert": cti
        }
        return self.__db.get_collection(self.__collection_name).update_one(filter=query_filter, update=update_query,
                                                                           upsert=True)

    def get_all_ctis(self):
        query = {}
        cursor = self.__db.get_collection(self.__collection_name).find(query)
        result = []
        try:
            for document in cursor:
                if "created" in document:
                    document["created"] = document["created"]
                if "modified" in document:
                    document["modified"] = document["modified"]
                result.append(document)
            return result
        except Exception:
            traceback.print_exc()
            return None

    def get_cti_by_id(self, id):
        query = {"_id": id}
        result = self.__db.get_collection(self.__collection_name).find(query).sort("modified", -1).limit(
            1)
        try:
            result = result.next()
            if "created" in result:
                result["created"] = result["created"]
            if "modified" in result:
                result["modified"] = result["modified"]
            return result
        except Exception:
            traceback.print_exc()
            return None


    def get_cti_list_by_name(self, name):
        query = {"name": {"$regex": name}}
        cursor = self.__db.get_collection(self.__collection_name).find(query).sort("modified", +1)
        result = []
        try:
            for document in cursor:
                if "created" in document:
                    document["created"] = document["created"]
                if "modified" in document:
                    document["modified"] = document["modified"]
                result.append(document)
            return result
        except Exception:
            traceback.print_exc()
            return None
