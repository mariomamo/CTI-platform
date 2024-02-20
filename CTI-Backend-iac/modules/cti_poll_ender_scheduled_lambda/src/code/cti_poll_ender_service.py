from cti_poll_ender_blockchain_service import CtiPollEnderBlockchainService
from database import DocumentDb
from datetime import datetime, timezone
import logging


class CtiPollEnderService:

    def __init__(self, cti_poll_ender_blockchain_service: CtiPollEnderBlockchainService, database_client: DocumentDb):
        self.__cti_poll_ender_blockchain_service = cti_poll_ender_blockchain_service
        self.__database_client = database_client
        logging.basicConfig()
        logger = logging.getLogger()
        logger.setLevel(logging.INFO)
        self.__logger = logger

    def close_cti_polls(self):
        events_list = self.__database_client.get_events('CtiDeployed')

        for event in events_list:
            self.__manage_single_cti_deployed_event(event)

    def __manage_single_cti_deployed_event(self, event: dict):
        now_timestamp = int(datetime.now(timezone.utc).timestamp())
        if now_timestamp > event['event_values']['expirationTime']:
            close_cti_result = self.__cti_poll_ender_blockchain_service.close_cti_and_get_is_closed_status(
                event['event_values']['ctiAddress'])
            if close_cti_result:
                delete_result = self.__database_client.delete_event(event['_id'])
                if delete_result:
                    self.__logger.error(f"CTI {event['event_values']['ctiAddress']} successfully removed from db!")
                else:
                    self.__logger.error(f"Error when removing CTI {event['event_values']['ctiAddress']} from db!")
        else:
            self.__logger.info(f"CTI {event['event_values']['ctiAddress']} not yet expired!")
