import ctiOracleAbi from "./abi/CTIOracle.json";
import useWeb3Utils from "./Web3Utils.jsx";

const _oracleTokenContractAddress = import.meta.env.VITE_CTI_ORACLE_CONTRACT_ADDRESS;

const useOracleServiceHook = (oracleTokenContractAddress=_oracleTokenContractAddress) => {
    const web3Utils = useWeb3Utils();
    const web3 = web3Utils.web3;
    const oracleTokenContract = new web3.eth.Contract(ctiOracleAbi, oracleTokenContractAddress);

    const getOneCtiPrice = () => {
        return oracleTokenContract.methods.oneDollarInCti().call().then(result => Number(result));
    }

    return {getOneCtiPrice}
}

export default useOracleServiceHook;