import Web3 from "web3";

const _jsonRpcURL = import.meta.env.VITE_ETH_NETWORK;

const useWeb3Utils = (jsonRpcURL = _jsonRpcURL) => {
    const web3 = new Web3(jsonRpcURL);

    const getEstimatedGasAndGasPrice = (contractMethod, tx) => {
        return new Promise((resolve, reject) => {
            return contractMethod.estimateGas(tx)
                .then(estimatedGas => {
                    return web3.eth.getGasPrice()
                        .then(gasPrice => resolve({
                            "estimatedGas": Number(estimatedGas),
                            "gasPrice": Number(gasPrice)
                        }))
                })
                .catch(error => reject(error));
        });
    }

    return {web3, getEstimatedGasAndGasPrice}
}

export default useWeb3Utils;