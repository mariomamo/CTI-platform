import json
from eth_typing import Address
from web3 import Web3, HTTPProvider
import logging


class CtiPollEnderBlockchainService:
    __CTI_ALREADY_CLOSED = "Cti already closed"
    __TIME_TO_VOTE_NOT_EXPIRED = "Time to vote this proposal has not expired"

    def __init__(self, rpc_url: str, private_key: str):
        self.__w3 = Web3(HTTPProvider(rpc_url))
        self.__account = self.__w3.eth.account.from_key(private_key)
        self.__chain_id = self.__w3.eth.chain_id
        logging.basicConfig()
        logger = logging.getLogger()
        logger.setLevel(logging.INFO)
        self.__logger = logger

    def close_cti_and_get_is_closed_status(self, contract_address: str):
        try:
            cti_contract = self.__w3.eth.contract(address=Address(bytes.fromhex(contract_address[2:])),
                                                  abi=json.load(open("/opt/abi/cti.json", "r")))

            nonce = self.__w3.eth.get_transaction_count(self.__account.address)
            call_function = cti_contract.functions.close().build_transaction({"chainId": self.__chain_id,
                                                                              "from": self.__account.address,
                                                                              "nonce": nonce})

            signed_tx = self.__account.sign_transaction(call_function)
            send_tx = self.__w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            self.__w3.eth.wait_for_transaction_receipt(send_tx)
            self.__logger.info("CTI closed successfully")
            return True
        except Exception as ex:
            if self.__TIME_TO_VOTE_NOT_EXPIRED in str(ex):
                self.__logger.error("CTI not expired!")
                return False
            elif self.__CTI_ALREADY_CLOSED in str(ex):
                self.__logger.info("CTI already closed!")
                return True
            else:
                self.__logger.error("Unknown error when closing cti!")
                return False
