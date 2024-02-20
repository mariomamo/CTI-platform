from service.aws_service import AWSApiGatewayStorageService


class EventReaderService:
    def __init__(self, aws_api_gateway_storage_service: AWSApiGatewayStorageService):
        self.__aws_api_gateway_storage_service = aws_api_gateway_storage_service

    def handle_event(self, event: dict):
        return self.__aws_api_gateway_storage_service.store_event(event['event'],
                                                                  event['transactionHash'].hex(),
                                                                  event['blockHash'].hex(),
                                                                  event['blockNumber'],
                                                                  event['logIndex'],
                                                                  event['transactionIndex'],
                                                                  event['address'],
                                                                  vars(event['args']))
