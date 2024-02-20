import MetaMaskSDK from "@metamask/sdk";

export default class MetamaskDesktopWallet {
    #defaultWalletOperations;
    #provider;
    #wallet;
    #intervalId;

    constructor(defaultWalletOperations) {
        this.#defaultWalletOperations = defaultWalletOperations;
    }

    connect = () => {
        // Wallet must be created just once
        return new Promise((resolve, reject) => {
            if (!this.#wallet) {
                this.#wallet = new MetaMaskSDK({
                    openDeeplink: (link) => {
                        window.open(link); // Use React Native Linking method or another way of opening deeplinks.
                    },
                    dappMetadata: {
                        name: 'CTI', // The name of your dapp.
                        url: 'https://mariooffertucci.altervista.org/CTI/index.html#/login', // The URL of your website.
                        base64Icon: "data:image/png;base64,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"
                    }
                });
            }
            this.#wallet.connect().then(() => {
                this.#provider = this.#wallet.getProvider();
                clearInterval(this.#intervalId);
                let maxRetry = 30;
                this.#intervalId = setInterval(() => {
                    this.#provider = this.#wallet.getProvider();
                    if (this.#provider.selectedAddress) {
                        clearInterval(this.#intervalId);
                        resolve(this.#provider.selectedAddress);
                    }
                    if (maxRetry === 0) {
                        clearInterval(this.#intervalId);
                        reject("Provider not found");
                    }
                    maxRetry--;
                }, 1000)
            }).catch(error => reject(error));
        });
    }

    terminate = () => {
        try {
            this.#wallet.terminate();
        } catch (error) {
            console.log("ERROR WHILE TERMINATING METAMASK: ", error);
        }
    }

    isConnected = () => this.#defaultWalletOperations.isConnected(this.#provider);

    request = (json_data) => this.#defaultWalletOperations.request(this.#provider, json_data);

    sign = (nonce) => {
        if (!this.#provider || !this.#provider.isConnected()) {
            return this.connect()
                .then(() => this.#defaultWalletOperations.sign(this.#provider, nonce));
        }
        return this.#defaultWalletOperations.sign(this.#provider, nonce);
    }

    getAddress = ()=> {
        return this.#provider.selectedAddress;
    }

    getProvider = () => {
        return this.#provider;
    }

}