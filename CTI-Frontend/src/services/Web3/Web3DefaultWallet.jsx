export default class Web3DefaultWallet {
    provider;
    defaultWalletOperations;

    constructor(defaultWalletOperations, provider) {
        this.defaultWalletOperations = defaultWalletOperations;
        this.provider = provider;
    }

    connect = () => {
        return this.request({method:'eth_requestAccounts'});
    }

    // terminate = () => throw new Error('Disconnection not supported yet');

    isConnected = () => this.defaultWalletOperations.isConnected(this.provider);

    request = (json_data) => this.defaultWalletOperations.request(this.provider, json_data);

    sign = (nonce) => {
        if (!this.isConnected()) {
            return this.connect()
                .then(() => this.defaultWalletOperations.sign(this.provider, nonce))
        }
        return this.defaultWalletOperations.sign(this.provider, nonce);
    }

    getAddress = ()=> {
        return this.provider.selectedAddress;
    }

    _toHex = (stringToConvert) => this.defaultWalletOperations._toHex(stringToConvert);

}
