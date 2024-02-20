import time
import json
from web3 import Web3
import logging
from service.aws_service import AWSApiGatewayStorageService
from service.event_reader_service import EventReaderService

ABI_PATH = "./abi/cti_factory_abi.json"
cti_factory_address = '0x5689C9eaB2e3E2c490A9e4BdF42Bd49273C21176'
blockchain_url = 'http://127.0.0.1:7545'
profile_name = "default"
api_gateway_base_url = "tdhm9kda5m.execute-api.eu-central-1.amazonaws.com"
aws_region = "eu-central-1"
prod_base_endpoint = "default"

aws_api_gateway_storage_service = AWSApiGatewayStorageService(profile_name, api_gateway_base_url, aws_region,
                                                              prod_base_endpoint)
event_reader_service = EventReaderService(aws_api_gateway_storage_service)
logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handle_event(event: dict):
    try:
        event_reader_service.handle_event(event)
    except Exception as ex:
        logger.error(f"There was an error when saving the event: {str(ex)}")


def read_cti_deployed_events(event_filter, poll_interval):
    while True:
        for cti_deployed in event_filter.get_new_entries():
            handle_event(cti_deployed)
        time.sleep(poll_interval)
        logger.info("Still listening...")


def main():
    web3 = Web3(Web3.HTTPProvider(blockchain_url))
    contract = web3.eth.contract(address=cti_factory_address, abi=json.load(open(ABI_PATH, "r")))
    event_filter = contract.events.CtiDeployed.create_filter(fromBlock="latest")
    read_cti_deployed_events(event_filter, 5)


if __name__ == "__main__":
    main()
