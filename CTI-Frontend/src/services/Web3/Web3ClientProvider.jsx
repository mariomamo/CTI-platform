import WalletProviderType from "../../enums/WalletProviderType.jsx";
import Web3DefaultWallet from "./Web3DefaultWallet.jsx";
import MetamaskDesktopWallet from "./Metamask/MetamaskDesktopWallet.jsx";
import MetamaskMobileWallet from "./Metamask/MetamaskMobileWallet.jsx";
import {Platform} from "../../enums/Platform.jsx";
import storageKeys from "../../enums/StorageKeys.jsx";

export default class Web3ClientProvider {
    #defaultWalletOperations;
    #providers;
    #selected_provider;
    #storageService;
    #platformProviderService;
    // Wallets must be created just once
    #metamask_desktop = null;
    #metamask_mobile = null;
    #coinbase_desktop = null;
    #coinbase_mobile = null;

    constructor(defaultWalletOperations, storageService, platformProviderService) {
        this.#defaultWalletOperations = defaultWalletOperations;
        if (window.ethereum) {
            this.#providers = window.ethereum.providers;
        }
        this.#storageService = storageService;
        this.#platformProviderService = platformProviderService;

        storageService.get(storageKeys.WALLET_PROVIDER.description)
            .then(wallet_provider => this.set(wallet_provider))
            .catch(() => this.set());
    }

    set(provider) {
        this.#storageService.set(storageKeys.WALLET_PROVIDER.description, provider);
        switch (provider) {
            case WalletProviderType.COINBASE.description:
                this.#selected_provider = this.#get_coinbase_wallet();
                break;
            default:
                this.#storageService.set(storageKeys.WALLET_PROVIDER.description, WalletProviderType.METAMASK.description);
                this.#selected_provider = this.#get_metamask_wallet();
        }
    }

    get() {
        return this.#selected_provider;
    }

    #get_coinbase_wallet = ()=> {
        switch (this.#platformProviderService.getPlatform().description) {
            case Platform.ANDROID || Platform.IOS:
                return this.#coinbase_mobile;
            default:
                if (this.#providers) {
                    return this.#create_and_get_coinbase_desktop();
                } else {
                    return this.#create_and_get_coinbase_mobile();
                }
        }
    }

    #get_metamask_wallet = ()=> {
        switch (this.#platformProviderService.getPlatform().description) {
            case Platform.ANDROID.description || Platform.IOS.description:
                return this.#create_and_get_metamask_mobile();
            default:
                return this.#create_and_get_metamask_desktop();
        }
    }

    #create_and_get_metamask_mobile() {
        if (this.#metamask_mobile === null) {
            this.#metamask_mobile = new MetamaskMobileWallet(this.#defaultWalletOperations);
        }
        return this.#metamask_mobile;
    }

    #create_and_get_metamask_desktop() {
        if (this.#metamask_desktop === null) {
            this.#metamask_desktop = new MetamaskDesktopWallet(this.#defaultWalletOperations);
        }
        return this.#metamask_desktop;
    }

    #create_and_get_coinbase_mobile() {
        if (this.#coinbase_mobile === null) {
            this.#coinbase_mobile = null;
        }
        return this.#coinbase_mobile;
    }

    #create_and_get_coinbase_desktop() {
        if (this.#coinbase_desktop === null && this.#providers) {
            this.#coinbase_desktop = new Web3DefaultWallet(this.#defaultWalletOperations, this.#providers.find((provider) => provider.isCoinbaseWallet));
        }
        return this.#coinbase_desktop;
    }
}