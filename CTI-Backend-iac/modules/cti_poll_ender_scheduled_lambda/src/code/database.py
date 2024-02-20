from pymongo import MongoClient


class DocumentDb:
    def __init__(self, connection_string: str, db_name: str, collection_name: str):
        self.__client = MongoClient(connection_string)
        self.__db = self.__client.get_database(name=db_name)
        self.__collection_name = collection_name

    def get_events(self, event: str):
        query = {"event": event}
        cursor = self.__db.get_collection(self.__collection_name).find(query)
        result = []

        [result.append(doc) for doc in cursor.next()]
        return result

    def delete_event(self, event_id: str):
        result = self.__db.get_collection(self.__collection_name).delete_one({"_id": event_id})
        if result.deleted_count == 1:
            return True
        else:
            return False
