import {useEffect, useState} from "react";
import WalletProviderType from "../../../enums/WalletProviderType.jsx";
import {useNavigate} from "react-router-dom";
import StorageKeys from "../../../enums/StorageKeys.jsx";
import {toast} from "react-hot-toast";
import useWalletInfo from "../../../hooks/WalletInfoHook.jsx";
import RouterPaths from "../../../enums/RoutesPaths.jsx";
import {useWalletProvider} from "../../../contexts/web3Wallet/Web3WalletProvider.jsx";
import {useStorage} from "../../../contexts/storage/WebStorageProvider.jsx";
import PropTypes from "prop-types";
import _useAuthorizationService from "../../../services/AuthorizationServiceHook.jsx";

const useLoginPageHook = (useAuthorizationService=_useAuthorizationService) => {
    const defaultWalletDivClass = "wallet-info-container";
    const [metamaskWalletDivClass, setMetamaskWalletDivClass] = useState(defaultWalletDivClass + " selected");
    const [coinbaseWalletDivClass, setCoinbaseWalletDivClass] = useState(defaultWalletDivClass);
    const walletProvider = useWalletProvider();
    const navigate = useNavigate();
    const walletInfo = useWalletInfo();
    const storageService = useStorage();
    const authorizationService = useAuthorizationService();

    useEffect(() => {
        storageService.get(StorageKeys.WALLET_PROVIDER.description)
            .then(wallet_provider => change_wallet_selection(wallet_provider));
    }, []);

    const change_wallet_selection = (newWallet) => {
        switch (newWallet) {
            case WalletProviderType.COINBASE.description:
                setCoinbaseWalletDivClass(defaultWalletDivClass + " selected");
                setMetamaskWalletDivClass(defaultWalletDivClass);
                walletProvider.set(WalletProviderType.COINBASE.description);
                break;
            default:
                setMetamaskWalletDivClass(defaultWalletDivClass + " selected");
                setCoinbaseWalletDivClass(defaultWalletDivClass);
                walletProvider.set(WalletProviderType.METAMASK.description);
        }
    }

    const login = () => {
        return new Promise((resolve, reject) => {
            _connect_to_wallet()
                .then(address => authorizationService.get_nonce(address))
                .then(nonce => walletProvider.get().sign(nonce))
                .then(signed_message => authorizationService.login(walletProvider.get().getAddress(), signed_message))
                .then(res => {
                    resolve(res);
                    navigate(RouterPaths.PROFILE.description);
                })
                .catch(error => {
                    if (error.code !== -32002) toast.error("An error occurred", {duration: 1000});
                    walletInfo.deleteState();
                    reject(error);
                })
        });
    }

    const _connect_to_wallet = () => {
        return new Promise((resolve, reject) => {
            if (walletProvider.get()) {
                walletProvider.get().connect()
                    .then(address => {
                        walletInfo.setAddress(address);
                        resolve(address);
                    })
                    .catch(error => reject(error));
            } else {
                reject("Web3 client not found");
            }
        });
    }

    return {login, change_wallet_selection, metamaskWalletDivClass, coinbaseWalletDivClass}
}

useLoginPageHook.propTypes = {
    useAuthorizationService: PropTypes.func,
};

useLoginPageHook.defaultProps = {
    useAuthorizationService: _useAuthorizationService,
};


export default useLoginPageHook;