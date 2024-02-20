import ctiFactoryAbi from "../Web3/abi/CTIFactory.json";
import PropTypes from "prop-types";
import useCtiService from "./CtiServiceHook.jsx";
import NotFoundError from "../../exceptions/NotFoundError.jsx";
import useWeb3Utils from "./Web3Utils.jsx";
import axios from "axios";

const _ctiFactoryContractAddress = import.meta.env.VITE_CTI_FACTORY_CONTRACT_ADDRESS;
const _ctiLambdaBaseUrl = import.meta.env.VITE_CTI_ACCESS_LAMBDA_BASE_URL;

const useCtiFactoryService = (ctiFactoryContractAddress = _ctiFactoryContractAddress, ctiLambdaBaseUrl = _ctiLambdaBaseUrl) => {
    const ctiService = useCtiService();
    const web3Utils = useWeb3Utils();
    const web3 = web3Utils.web3;
    const ctiFactoryContract = new web3.eth.Contract(ctiFactoryAbi, ctiFactoryContractAddress);
    const cti_url = ctiLambdaBaseUrl + "/cti";

    const deployCti = (cti, accessToken) => {
        const headers = {"Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`};
        return axios.put(cti_url, {"cti": cti.toJson()}, {headers: headers});
    }

    const getCtiInfoByHash = (hash, accessToken) => {
        const headers = {"Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`};
        return axios.get(`${cti_url}?id=${hash}`, {headers: headers});
    }

    const getAllCtis = () => {
        return new Promise(async resolve => {
            const elements = [];
            try {
                const ctiAddresses = await ctiFactoryContract.methods.getAllDeployedCtiList().call();
                await Promise.all(ctiAddresses.map(async address => elements.push(await ctiService.getCti(address, elements))))
            } catch (ex) {
                // Suppress exception
                console.log("error: ", ex);
            } finally {
                resolve(elements);
            }
        });
    }

    return {deployCti, getCtiInfoByHash, getAllCtis}
}

useCtiFactoryService.propTypes = {
    ctiFactoryContractAddress: PropTypes.string,
    ctiLambdaBaseUrl: PropTypes.string
};

useCtiFactoryService.defaultProps = {
    ctiFactoryContractAddress: _ctiFactoryContractAddress,
    ctiLambdaBaseUrl: _ctiLambdaBaseUrl
};

export default useCtiFactoryService;