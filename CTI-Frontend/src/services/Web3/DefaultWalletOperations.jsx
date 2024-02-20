export default class DefaultWalletOperations {

    isConnected = (provider)=> {
        if (provider) {
            return provider.isConnected();
        }
        return false;
    }

    request = (provider, json_data)=> {
        if (provider) {
            return provider.request(json_data);
        }
        return new Promise((accept, reject) => reject("Wallet provider not found"));
    }

    sign = (provider, nonce)=> {
        return this.request(provider, {
            method: 'personal_sign',
            params: [
                `0x${this.#toHex(nonce)}`,
                provider.selectedAddress,
            ],
        })
    }

    #toHex = (stringToConvert) => {
        return stringToConvert
            .split('')
            .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
    }

}
