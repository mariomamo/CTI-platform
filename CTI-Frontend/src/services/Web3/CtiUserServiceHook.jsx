import {useWalletProvider} from "../../contexts/web3Wallet/Web3WalletProvider.jsx";
import ctiUserAbi from "./abi/CTIUser.json";
import useWeb3Utils from "./Web3Utils.jsx";

const _ctiUserContractAddress = import.meta.env.VITE_CTI_USERS_CONTRACT_ADDRESS;

const useCtiUserService = (ctiUserContractAddress=_ctiUserContractAddress) => {
    const walletProvider = useWalletProvider();
    const web3Utils = useWeb3Utils();
    const web3 = web3Utils.web3;
    const userContract = new web3.eth.Contract(ctiUserAbi, ctiUserContractAddress);

    //TODO: L'address dovrebbe essere preso dal token jwt?
    const registerUser = (addressToRegister, tier) => {
        return walletProvider.get().connect()
            .then(address => {
                const tx = {from: address}
                return web3Utils.getEstimatedGasAndGasPrice(userContract.methods.register(addressToRegister, tier), tx)
                    .then(response => {
                        return userContract.methods.register(addressToRegister, tier).send({
                            ...tx,
                            gas: response.estimatedGas,
                            gasPrice: web3.utils.toHex(response.gasPrice)
                        })
                    })
            });
    }

    const getUserInfo = () => {
        return new Promise((resolve, reject) => {
            return walletProvider.get().connect()
                .then(address => {
                    const tx = {from: address}
                    return web3Utils.getEstimatedGasAndGasPrice(userContract.methods.getUserInfo(), tx)
                        .then(() => userContract.methods.getUserInfo().call(tx))
                        .then(res => resolve(res))
                        .catch(error => reject(error));
                });
        })
    }

    return {ctiUserContractAddress, registerUser, getUserInfo}
}

export default useCtiUserService;