import {useWalletProvider} from "../../contexts/web3Wallet/Web3WalletProvider.jsx";
import ctiTokenAbi from "../Web3/abi/CTIToken.json";
import useWeb3Utils from "./Web3Utils.jsx";

const _ctiTokenContractAddress = import.meta.env.VITE_CTI_TOKEN_CONTRACT_ADDRESS;

const useCtiTokenService = (ctiTokenContractAddress=_ctiTokenContractAddress) => {
    const walletProvider = useWalletProvider();
    const web3Utils = useWeb3Utils();
    const web3 = web3Utils.web3;
    const ctiTokenContract = new web3.eth.Contract(ctiTokenAbi, ctiTokenContractAddress);

    //TODO: L'address dovrebbe essere preso dal token jwt?
    const approve = (approveTo, amountToApprove) => {
        return walletProvider.get().connect()
            .then(address => {
                return ctiTokenContract.methods.approve(approveTo, amountToApprove).send({
                    from: address
                })
            })
    }

    const getTotalSupply = () => {
        return ctiTokenContract.methods.totalSupply().call();
        // return new Promise((resolve, reject) => {
        //     ctiTokenContract.methods.totalSupply().call()
        //         .then(result => resolve(result))
        //         .catch(error => reject(error))
        // })
    }

    return {approve, getTotalSupply}
}

export default useCtiTokenService;