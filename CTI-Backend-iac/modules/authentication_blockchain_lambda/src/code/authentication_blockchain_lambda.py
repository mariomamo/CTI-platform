import os
import uuid

from aws_lambda_powertools.event_handler import ApiGatewayResolver
from eth_account.messages import encode_defunct
from web3 import Web3, HTTPProvider
from hexbytes import HexBytes
from database import DocumentDb
from blockchian_service import BlockchainUserService
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)
prod_endpoint = os.getenv('PROD_ENDPOINT')
documentdb_connection_string = os.getenv("DOCUMENTDB_CONNECTION_STRING")
db_name = os.getenv('DB_NAME')
collection_name = os.getenv('COLLECTION_NAME')
ethereum_node_url = os.getenv('ETHEREUM_NODE_URL')
cti_user_address = os.getenv('CTI_USER_ADDRESS')
w3 = Web3(HTTPProvider(ethereum_node_url, request_kwargs={"verify": False}))
document_db_client = DocumentDb(documentdb_connection_string, db_name, collection_name)
blockchain_user_service = BlockchainUserService(ethereum_node_url, cti_user_address)
app = ApiGatewayResolver()


def get_nonce_and_register_user_if_not_present(address: str):
    nonce_document = document_db_client.get_nonce_document_by_address(address.lower())
    if not nonce_document:
        user_info = blockchain_user_service.get_user_info(address)
        if user_info["isRegistered"]:
            nonce = str(uuid.uuid4())
            document_db_client.register_user(address, nonce)
            return nonce
        else:
            raise ValueError(f"The address {address} is not registered.")
    else:
        return nonce_document['nonce']

def get_and_validate_nonce_document(address: str):
    nonce_document = document_db_client.get_nonce_document_by_address(address.lower())
    if not nonce_document:
        raise ValueError(f"The address {address} is not registered.")
    else:
        return nonce_document


@app.get(f"/{prod_endpoint}/blockchain/nonce/<address>")
def get_nonce(address: str):
    try:
        nonce = get_nonce_and_register_user_if_not_present(address)
        return {"nonce": nonce}
    except ValueError as ex:
        logger.error(f"Error while getting nonce: {str(ex)}")
        return {"error": "User not registered"}


@app.post(f"/{prod_endpoint}/blockchain/verify-signature")
def verify_signature():
    try:
        body = app.current_event.json_body
        nonce_document = get_and_validate_nonce_document(body['address'])
        message_hash = encode_defunct(text=nonce_document['nonce'])
        address = w3.eth.account.recover_message(message_hash, signature=HexBytes(body['signature']))
        if nonce_document['address'].lower() == address.lower():
            document_db_client.update_nonce_by_address(address, str(uuid.uuid4()))
            return {"result": "Succeeded"}
        else:
            return {'result': 'Failed', "error": "Invalid signature"}
    except Exception as ex:
        logger.error(f"Error while verifying signature: {str(ex)}")
        return {"result": 'Failed', "error": "Unknown error. Please retry"}


def handler(event, context):
    return app.resolve(event, context)


if __name__ == '__main__':
    try:
        raise ValueError("mariome")
    except ValueError as e:
        print(str(e))
