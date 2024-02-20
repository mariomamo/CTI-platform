import airdropAbi from "./abi/CTIAirdrop.json";
import {useWalletProvider} from "../../contexts/web3Wallet/Web3WalletProvider.jsx";
import useWeb3Utils from "./Web3Utils.jsx";

const _airdropContractAddress = import.meta.env.VITE_CTI_AIRDROP_CONTRACT_ADDRESS;

const useAirdropService = (airdropContractAddress = _airdropContractAddress) => {
    const walletProvider = useWalletProvider();
    const web3Utils = useWeb3Utils();
    const web3 = web3Utils.web3;
    const airdropContract = new web3.eth.Contract(airdropAbi, airdropContractAddress);

    //TODO: L'address dovrebbe essere preso dal token jwt?
    const claim = () => {
        return walletProvider.get().connect()
            .then(address => {
                return airdropContract.methods.claim().send({
                    from: address
                })
            })
    }

    return {claim}
}

export default useAirdropService;