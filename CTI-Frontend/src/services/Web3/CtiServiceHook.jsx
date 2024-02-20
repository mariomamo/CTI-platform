import {useWalletProvider} from "../../contexts/web3Wallet/Web3WalletProvider.jsx";
import ctiJsonAbi from "./abi/CTI.json";
import {CtiStatus} from "../../enums/CtiStatus.jsx";
import {CtiStatusIndexes} from "../../enums/CtiStatusIndexes.jsx";
import useWeb3Utils from "./Web3Utils.jsx";

const useCtiService = () => {
    const walletProvider = useWalletProvider();
    const web3Utils = useWeb3Utils();
    const web3 = web3Utils.web3;

    //TODO: L'address dovrebbe essere preso dal token jwt?
    const accept = (ctiContractAddress) => {
        const ctiContract = new web3.eth.Contract(ctiJsonAbi, ctiContractAddress);
        let tx;
        return walletProvider.get().connect()
            .then(address => {
                tx = {from: address};
                return web3Utils.getEstimatedGasAndGasPrice(ctiContract.methods.valid(), tx)
                    .then(response => {
                        return ctiContract.methods.valid().send({
                            ...tx,
                            gas: response.estimatedGas,
                            gasPrice: web3.utils.toHex(response.gasPrice)
                        })
                    })
            })
    }

    const reject = (ctiContractAddress) => {
        const ctiContract = new web3.eth.Contract(ctiJsonAbi, ctiContractAddress);
        let tx;
        return walletProvider.get().connect()
            .then(address => {
                tx = {from: address};
                return web3Utils.getEstimatedGasAndGasPrice(ctiContract.methods.invalid(), tx)
                    .then(response => {
                        return ctiContract.methods.invalid().send({
                            ...tx,
                            gas: response.estimatedGas,
                            gasPrice: web3.utils.toHex(response.gasPrice)
                        })
                    })
            })
    }

    const abstain = (ctiContractAddress) => {
        const ctiContract = new web3.eth.Contract(ctiJsonAbi, ctiContractAddress);
        let tx;
        return walletProvider.get().connect()
            .then(address => {
                tx = {from: address};
                return web3Utils.getEstimatedGasAndGasPrice(ctiContract.methods.abstain(), tx)
                    .then(response => {
                        return ctiContract.methods.abstain().send({
                            ...tx,
                            gas: response.estimatedGas,
                            gasPrice: web3.utils.toHex(response.gasPrice)
                        })
                    })
            })
    }

    const getCti = async (address) => {
        const ctiContract = new web3.eth.Contract(ctiJsonAbi, address);
        const ctiName = await ctiContract.methods.ctiName().call();
        const votingDuration = await ctiContract.methods.votingDuration().call();
        let expirationTime = await ctiContract.methods.expirationTime().call();
        let endingVote = new Date(Number(expirationTime) * 1000).toLocaleDateString("en-GB");
        const startingVote = new Date((Number(expirationTime) - (Number(votingDuration))) * 1000).toLocaleDateString("en-GB");
        const voteStatus = Number(await ctiContract.methods.voteStatus().call());
        const ctiId = await ctiContract.methods.ctiId().call();
        const ctiHash = await ctiContract.methods.ctiHash().call();
        const voteAmounts = await ctiContract.methods.voteAmounts().call();
        return {
            address: address,
            id: ctiId,
            hash: ctiHash,
            title: ctiName,
            status: voteStatus === Number(CtiStatusIndexes.PENDING.description) ? CtiStatus.PENDING.description : voteStatus === Number(CtiStatusIndexes.INVALID.description) ? CtiStatus.INVALID.description : CtiStatus.VALID.description,
            startingVote: startingVote,
            endingVote: endingVote,
            voteAmounts: voteAmounts
        }
    }

    return {accept, reject, abstain, getCti}
}

export default useCtiService;