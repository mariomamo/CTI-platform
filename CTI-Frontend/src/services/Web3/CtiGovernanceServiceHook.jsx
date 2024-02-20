import ctiGovernanceAbi from "../Web3/abi/CTIGovernance.json";
import {useWalletProvider} from "../../contexts/web3Wallet/Web3WalletProvider.jsx";
import useWeb3Utils from "./Web3Utils.jsx";

const _ctiGovernanceContractAddress = import.meta.env.VITE_CTI_GOVERNANCE_CONTRACT_ADDRESS;

const useCtiGovernanceService = (ctiGovernanceContractAddress=_ctiGovernanceContractAddress) => {
    const walletProvider = useWalletProvider();
    const web3Utils = useWeb3Utils();
    const web3 = web3Utils.web3;
    const ctiGovernanceContract = new web3.eth.Contract(ctiGovernanceAbi, ctiGovernanceContractAddress);

    //TODO: L'address dovrebbe essere preso dal token jwt?
    const depositToken = (amountToDeposit) => {
        return walletProvider.get().connect()
            .then(address => {
                return ctiGovernanceContract.methods.depositTokens(amountToDeposit).send({
                    from: address
                })
            })
    }

    const getDepositedTokens = () => {
        return walletProvider.get().connect()
            .then(address => {
                return ctiGovernanceContract.methods.getDepositedTokensByAddress(address).call({
                    from: address
                })
            })
    }

    const withdrawTokens = (amountToWithdraw) => {
        return walletProvider.get().connect()
            .then(address => {
                return ctiGovernanceContract.methods.withdrawTokens(amountToWithdraw).call({
                    from: address
                })
            })
    }

    const getListOfVotedCti = () => {
        return walletProvider.get().connect()
            .then(address => {
                return ctiGovernanceContract.methods.getListOfVotedCti().call({
                    from: address
                })
            })
    }

    return {ctiGovernanceContractAddress, depositToken, getDepositedTokens, withdrawTokens, getListOfVotedCti}
}

export default useCtiGovernanceService;