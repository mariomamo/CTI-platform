import boto3
import requests
from aws_requests_auth.aws_auth import AWSRequestsAuth


class AWSApiGatewayStorageService:
    __STORE_EVENTS_URL_PATH = "events"

    def __init__(self, profile_name: str, api_gw_base_url: str, aws_region: str, prod_base_endpoint: str):
        self.__access_key, self.__secret_key = self.__get_credentials(profile_name)
        self.__api_gw_base_url = api_gw_base_url
        self.__aws_region = aws_region
        self.__prod_base_endpoint = prod_base_endpoint

    def __get_credentials(self, profile_name: str):
        session = boto3.Session(profile_name=profile_name)
        credentials = session.get_credentials()
        return credentials.access_key, credentials.secret_key

    def store_event(self, event: str, transaction_hash: str, block_hash: str,
                    block_number: int, log_index: int, transaction_index: int,
                    contract_address: str, event_values: dict):
        auth = AWSRequestsAuth(aws_access_key=self.__access_key,
                               aws_secret_access_key=self.__secret_key,
                               aws_host=self.__api_gw_base_url,
                               aws_region=self.__aws_region,
                               aws_service='execute-api')

        payload = {
            "transaction_hash": transaction_hash,
            "block_hash": block_hash,
            "block_number": block_number,
            "log_index": log_index,
            "transaction_index": transaction_index,
            "contract_address": contract_address,
            "event_values": event_values
        }

        response = requests.put(f'https://{self.__api_gw_base_url}/{self.__prod_base_endpoint}/'
                                f'{self.__STORE_EVENTS_URL_PATH}/{event}', auth=auth, json=payload)

        return response.json()
