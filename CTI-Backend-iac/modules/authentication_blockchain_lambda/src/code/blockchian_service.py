import json

from eth_typing import Address
from web3 import Web3, HTTPProvider


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
