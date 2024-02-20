import json
from kafka import KafkaProducer
import logging


class CtiNotificationProducer:

    def __init__(self, bootstrap_servers: str, notification_topic: str):
        self.__logger = self.__get_logger()
        self.__producer = KafkaProducer(bootstrap_servers=bootstrap_servers, api_version=(0, 11, 5))
        self.__notification_topic = notification_topic

    def __get_logger(self):
        logger = logging.getLogger()
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        return logger

    def __single_send(self, topic_name: str, message: dict):
        result = self.__producer.send(topic_name, value=json.dumps(message).encode("UTF-8")).get(timeout=900000)
        self.__producer.flush()
        self.__logger.info(f"Send result: {result}")

    def produce_notification_message(self, message: str, operation_type: str, id: str, sha256_hash: str):
        notification_message = {
            "message": message,
            "operation_type": operation_type,
            "id": id,
            "sha256_hash": sha256_hash
        }
        self.__single_send(self.__notification_topic, notification_message)


if __name__ == '__main__':
    prod = CtiNotificationProducer("localhost:29092", "cti.notifications")
    prod.produce_notification_message("A new CTI has been inserted!", "INSERT", "abc", "hash")
