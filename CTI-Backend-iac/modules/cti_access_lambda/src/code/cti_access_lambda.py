import logging
import os
import traceback

from aws_lambda_powertools.event_handler import ApiGatewayResolver

from DocumentDb import DocumentDb
from blockchian_service import BlockchainUserService, BlockchainCtiFactoryService, BlockchainCtiOracleService, BlockchainCtiTokenService
from kafka_producer import CtiNotificationProducer
from access_lambda_service import AccessLambdaService

prod_endpoint = os.getenv('PROD_ENDPOINT')
app = ApiGatewayResolver()

documentdb_connection_string = os.getenv("DOCUMENTDB_CONNECTION_STRING")
db_name = os.getenv('DB_NAME')
collection_name = os.getenv('COLLECTION_NAME')
wallet_secret = os.getenv('WALLET_PRIVATE_KEY')
ethereum_node_url = os.getenv('ETHEREUM_NODE_URL')
cti_user_address = os.getenv('CTI_USER_ADDRESS')
cti_factory_address = os.getenv('CTI_FACTORY_ADDRESS')
cti_token_address = os.getenv('CTI_TOKEN_ADDRESS')
cti_oracle_address = os.getenv('CTI_ORACLE_ADDRESS')
kafka_bootstrap_server = os.getenv('KAFKA_BOOTSTRAP_SERVER')
notification_topic = os.getenv('NOTIFICATION_TOPIC')
documentDb = DocumentDb(documentdb_connection_string, db_name, collection_name)
blockchain_user_service = BlockchainUserService(ethereum_node_url, cti_user_address)
blockchain_cti_factory_service = BlockchainCtiFactoryService(ethereum_node_url, wallet_secret, cti_factory_address)
blockchain_cti_oracle_service = BlockchainCtiOracleService(ethereum_node_url, cti_oracle_address)
blockchain_cti_token_service = BlockchainCtiTokenService(ethereum_node_url, wallet_secret, cti_token_address)
cti_notification_producer = CtiNotificationProducer(kafka_bootstrap_server, notification_topic)
access_lambda_service = AccessLambdaService(documentDb, blockchain_user_service, blockchain_cti_factory_service,
blockchain_cti_token_service, blockchain_cti_oracle_service, cti_notification_producer)

logger = logging.getLogger()
logger.setLevel(logging.INFO)


@app.put(f"/{prod_endpoint}/cti")
def put_cti():
    body = app.current_event.json_body
    try:
        cti = body["cti"]
        jwt_token = app.current_event.get_header_value(name="Authorization", case_sensitive=False, default_value="")
        put_result = access_lambda_service.put_cti(jwt_token, cti)
        if put_result.upserted_id:
            return {"message": "CTI successfully added"}
        else:
            return {"message": "This CTI already exists"}
    except Exception as ex:
        logger.error(f"Error while inserting data \"{body}\" to document db: {ex}")
        traceback.print_exc()
        return {"message": "An unexpected error occurred. Please retry"}, 500


@app.get(f"/{prod_endpoint}/cti")
def get_cti_by_id():
    try:
        id = app.current_event.get_query_string_value("id")
        name = app.current_event.get_query_string_value("name")
        jwt_token = app.current_event.get_header_value(name="Authorization", case_sensitive=False, default_value="")
        cti = access_lambda_service.get_cti_data(id, name, jwt_token)
        return cti if cti else ({"message": "Cannot find the desired CTI"}, 404)
    except Exception as ex:
        logger.error(f"Error while processing the request: {ex}")
        traceback.print_exc()
        return {"message": "User not registered or expired subscription. Please retry if the user is correctly registered"}, 500


def handler(event, context):
    return app.resolve(event, context)


if __name__ == '__main__':
    cti_test = {
        "type": "example",
        "_id": "example--156487987984",
        "id": "example--156487987984",
        "name": "My Fourth vulnerability",
        "description": "this is the description"
    }
    # data = {
    #     "name": "Cti test",
    #     "description": "This is a test CTI"
    # }
    r = put_cti({"cti": cti_test})
    print(r)

    print(get_cti_by_id("example--156487987984"))
