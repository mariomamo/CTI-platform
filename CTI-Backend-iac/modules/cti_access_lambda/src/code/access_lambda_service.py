import hashlib
import json
import uuid
from datetime import datetime, timezone
import jwt

from DocumentDb import DocumentDb
from blockchian_service import BlockchainUserService, \
  BlockchainCtiFactoryService, BlockchainCtiOracleService, BlockchainCtiTokenService
from kafka_producer import CtiNotificationProducer


class AccessLambdaService:

    def __init__(self, documentDb: DocumentDb,
                 blockchain_user_service: BlockchainUserService,blockchain_cti_factory_service: BlockchainCtiFactoryService,
                 blockchain_cti_token_service: BlockchainCtiTokenService, blockchain_cti_oracle_service: BlockchainCtiOracleService,
                 cti_notification_producer: CtiNotificationProducer):
        self.__documentDb = documentDb
        self.__blockchain_user_service = blockchain_user_service
        self.__blockchain_cti_factory_service = blockchain_cti_factory_service
        self.__blockchain_cti_token_service = blockchain_cti_token_service
        self.__blockchain_cti_oracle_service = blockchain_cti_oracle_service
        self.__cti_notification_producer = cti_notification_producer

    def put_cti(self, jwt_token: str, cti: dict):
        address = self.__extract_address_from_jwt(jwt_token)
        self.__add_created_and_modified_fields(cti)
        cti["id"] = self.__generate_deterministic_id(cti)
        cti["_id"] = self.__create_hash_from_dict(cti)
        one_dollar_in_cti = self.__blockchain_cti_oracle_service.get_one_dollar_in_cti()
        total_reward_in_cti = one_dollar_in_cti * 10
        self.__blockchain_cti_token_service.mint_and_transfer_tokens(self.__blockchain_cti_factory_service.get_contract_address(),
                                                                     total_reward_in_cti)

        deploy_cti_result = self.__blockchain_cti_factory_service.add_cti(address, cti["mandatoryParameters"]["name"], cti["id"],
                                                                          cti["_id"], total_reward_in_cti)

        if deploy_cti_result["status"]:
            res = self.__documentDb.put_cti(cti)
            self.__cti_notification_producer.produce_notification_message("A new CTI has been inserted!", "INSERT", cti['id'], cti["_id"])
            return res

    def __get_all_ctis(self):
        return self.__documentDb.get_all_ctis()

    def __get_cti_by_id(self, id: str):
        return self.__documentDb.get_cti_by_id(id)

    def __get_cti_list_by_name(self, name: str):
        return self.__documentDb.get_cti_list_by_name(name)

    def __get_tier_if_valid_user(self, address: str):
        user_info = self.__blockchain_user_service.get_user_info(address)
        if not user_info:
          raise ValueError("User not registered")

        now_timestamp = int(datetime.now(timezone.utc).timestamp())

        if now_timestamp > user_info['endSubscription']:
          raise ValueError("Subscription expired")

        return user_info['tier']

    def __extract_address_from_jwt(self, jwt_token: str):
        decoded = jwt.decode(jwt_token[len("Bearer "):], options={"verify_signature": False})
        if decoded.get('id') is None:
            raise ValueError("Address claim (id) not present in provided JWT!")

        return decoded.get('id')


    def get_cti_data(self, id: str, name: str, jwt_token: str):
        address = self.__extract_address_from_jwt(jwt_token)
        tier = self.__get_tier_if_valid_user(address)
        cti = None
        if id:
            result = self.__get_cti_by_id(id)
            if result:
                cti = [result]
        elif name:
            result = self.__get_cti_list_by_name(name)
            if result:
                cti = [result]
        else:
            cti = self.__get_all_ctis()

        if not cti:
            return None
        return cti if tier == 1 else [{"mandatoryParameters": doc["mandatoryParameters"]} for doc in cti]

    def __create_hash_from_dict(self, dict_to_hash: dict):
        dict_dump = json.dumps(dict_to_hash).encode('UTF-8')
        return hashlib.sha256(dict_dump).hexdigest()

    @staticmethod
    def __add_created_and_modified_fields(cti: dict):
        # observed-data: non può avere nè created nè modified
        # marking-definition: non può avere modified
        if cti["type"] == "observed-data":
            del cti["mandatoryParameters"]["created"]
            del cti["mandatoryParameters"]["modified"]
        elif cti["type"] == "marking-definition":
            del cti["mandatoryParameters"]["modified"]
        else:
            cti["mandatoryParameters"]["created"] = datetime.utcnow().isoformat()
            cti["mandatoryParameters"]["modified"] = datetime.utcnow().isoformat()

    @staticmethod
    def __generate_deterministic_id(cti: dict):
        hash_object = hashlib.sha256(json.dumps(cti).encode())
        seed = hash_object.digest()[:16]
        return f"{cti['type']}--{uuid.UUID(bytes=seed, version=4)}"