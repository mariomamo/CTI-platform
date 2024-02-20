from aws_lambda_powertools.event_handler import ApiGatewayResolver
import os
from database import DocumentDb
import logging
import traceback

logger = logging.getLogger()
logger.setLevel(logging.INFO)
app = ApiGatewayResolver()
prod_endpoint = os.getenv('PROD_ENDPOINT')
documentdb_connection_string = os.getenv("DOCUMENTDB_CONNECTION_STRING")
db_name = os.getenv('DB_NAME')
collection_name = os.getenv('COLLECTION_NAME')
document_db_client = DocumentDb(documentdb_connection_string, db_name, collection_name)


@app.put(f"/{prod_endpoint}/events/<event>")
def save_event_inside_db(event: str):
    body = app.current_event.json_body
    try:
        result = document_db_client.insert_event(event, body['transaction_hash'], body['block_hash'],
                                                 body['block_number'],
                                                 body['log_index'], body['transaction_index'], body['contract_address'],
                                                 body['event_values'])
        logger.info(f"Event: {body} saved correctly to document db: {result}")
        return {"result": 'Event saved correctly'}
    except Exception as ex:
        logger.error(f"Error while inserting event {body} to document db: {str(ex)}")
        traceback.print_exc()
        return {"result": f"Error while inserting event {body}"}, 500


@app.get(f"/{prod_endpoint}/events/<event>")
def get_events_inside_db(event: str):
    try:
        result = document_db_client.get_events(event)
        logger.info(f"Got {len(result)} events of {event} kind from db")
        return {"result": result}
    except Exception as ex:
        logger.error(f"Error while getting {event} events with error: {str(ex)}")
        traceback.print_exc()
        return {"result": f"Error while getting {event} events"}, 500


def handler(event, context):
    return app.resolve(event, context)
