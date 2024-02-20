import os
from database import DocumentDb
from cti_poll_ender_blockchain_service import CtiPollEnderBlockchainService
from cti_poll_ender_service import CtiPollEnderService

documentdb_connection_string = os.getenv("DOCUMENTDB_CONNECTION_STRING")
db_name = os.getenv('DB_NAME')
collection_name = os.getenv('COLLECTION_NAME')
wallet_secret = os.getenv('WALLET_PRIVATE_KEY')
ethereum_node_url = os.getenv('ETHEREUM_NODE_URL')

document_db_client = DocumentDb(documentdb_connection_string, db_name, collection_name)
cti_poll_ender_blockchain_service = CtiPollEnderBlockchainService(ethereum_node_url, wallet_secret)
cti_poll_ender_service = CtiPollEnderService(cti_poll_ender_blockchain_service, document_db_client)


def handler(event, context):
    cti_poll_ender_service.close_cti_polls()
