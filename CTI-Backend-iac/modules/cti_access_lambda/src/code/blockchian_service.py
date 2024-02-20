import json

from eth_typing import Address
from web3 import Web3, HTTPProvider


class BlockchainCtiFactoryService:

    def __init__(self, rpc_url: str, private_key: str, cti_factory_address: str):
        self.__contract_address = cti_factory_address
        self.__w3 = Web3(HTTPProvider(rpc_url))
        self.__account = self.__w3.eth.account.from_key(private_key)
        self.__cti_factory_contract = self.__w3.eth.contract(address=Address(bytes.fromhex(cti_factory_address[2:])),
                                                             abi=json.load(open("/opt/abi/cti_factory.json", "r")))
        self.__chain_id = self.__w3.eth.chain_id

    def add_cti(self, proposer_address: str, cti_name: str, cti_id, cti_hash: str, reward_token_amount: int):
        proposer_address = Address(bytes.fromhex(proposer_address[2:]))
        nonce = self.__w3.eth.get_transaction_count(self.__account.address)
        call_function = self.__cti_factory_contract.functions.publishCti(proposer_address, cti_name, cti_id, cti_hash, reward_token_amount) \
            .build_transaction({"chainId": self.__chain_id, "from": self.__account.address, "nonce": nonce})

        signed_tx = self.__account.sign_transaction(call_function)
        send_tx = self.__w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        tx_receipt = self.__w3.eth.wait_for_transaction_receipt(send_tx)
        return tx_receipt

    def get_contract_address(self):
        return self.__contract_address


class BlockchainUserService:

    def __init__(self, rpc_url: str, cti_user_address: str):
        self.__w3 = Web3(HTTPProvider(rpc_url))
        self.__cti_user_contract = self.__w3.eth.contract(address=Address(bytes.fromhex(cti_user_address[2:])),
                                                          abi=json.load(open("/opt/abi/cti_users.json", "r")))

    def get_user_info(self, address: str):
        try:
            result = self.__cti_user_contract.functions.getUserInfo(self.__w3.to_checksum_address(address)).call()
            end_subscription, is_registered, tier, published_cti, valid_cti, invalid_cti, member_since = result
            return {"endSubscription": end_subscription, "isRegistered": is_registered, "tier": tier,
                    "publishedCti": published_cti, "validCti": valid_cti, "invalidCti": invalid_cti,
                    "memberSince": member_since}
        except Exception:
            return None


class BlockchainCtiOracleService:

    def __init__(self, rpc_url: str, cti_oracle_address: str):
        self.__w3 = Web3(HTTPProvider(rpc_url))
        self.__cti_oracle_contract = self.__w3.eth.contract(address=Address(bytes.fromhex(cti_oracle_address[2:])),
                                                            abi=json.load(open("/opt/abi/cti_oracle.json", "r")))

    def get_one_dollar_in_cti(self):
        try:
            return self.__cti_oracle_contract.functions.oneDollarInCti().call()
        except Exception:
            return None


class BlockchainCtiTokenService:

    def __init__(self, rpc_url: str, private_key: str, cti_token_address: str):
        self.__w3 = Web3(HTTPProvider(rpc_url))
        self.__account = self.__w3.eth.account.from_key(private_key)
        self.__cti_token_contract = self.__w3.eth.contract(address=Address(bytes.fromhex(cti_token_address[2:])),
                                                             abi=json.load(open("/opt/abi/cti_token.json", "r")))
        self.__chain_id = self.__w3.eth.chain_id

    def mint_and_transfer_tokens(self, to: str, amount: int):
        try:
            to_address = Address(bytes.fromhex(to[2:]))
            nonce = self.__w3.eth.get_transaction_count(self.__account.address)
            call_function = self.__cti_token_contract.functions.mintCtiToken(to_address, amount) \
                .build_transaction({"chainId": self.__chain_id, "from": self.__account.address, "nonce": nonce})

            signed_tx = self.__account.sign_transaction(call_function)
            send_tx = self.__w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            self.__w3.eth.wait_for_transaction_receipt(send_tx)
            return True
        except Exception:
            return None


if __name__ == '__main__':
    b = BlockchainCtiFactoryService("https://7166-87-1-159-133.ngrok-free.app",
                                    "0x47733e072182f21edca0eaafa05d03566847e7af70dba0b67d79744bc41d3b4a",
                                    "0x582f36C0D41133E5324739C28453429422e7f838")
    b.add_cti("0x7329159397320e68600F2EdD24852172BEa43226", "TEST", "AHDAJSHDSJDA")
