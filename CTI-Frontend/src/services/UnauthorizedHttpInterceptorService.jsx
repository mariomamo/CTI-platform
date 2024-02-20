import axios from "axios";
import useAuthorizationService from "./AuthorizationServiceHook.jsx";
import {useEffect} from "react";
import StorageKeys from "../enums/StorageKeys.jsx";
import {useStorage} from "../contexts/storage/WebStorageProvider.jsx";
import {useWalletProvider} from "../contexts/web3Wallet/Web3WalletProvider.jsx";

const useUnauthorizedHttpInterceptorService = () => {
    const authorizationService = useAuthorizationService();
    const storageService = useStorage();
    const walletProvider = useWalletProvider();
    const NO_RETRY_HEADER = 'x-no-retry'

    useEffect(() => {
        configure();
    }, []);

    const configure = () => {
        axios.interceptors.response.use(response => response, error => {
            if (!axios.isCancel(error) && axios.isAxiosError(error) && error.response.status === 401 && !error.config.headers[NO_RETRY_HEADER]) {
                error.config.headers[NO_RETRY_HEADER] = true;
                let address;
                walletProvider.get().connect()
                    .then(add => address = add)
                    .then(() => storageService.get(StorageKeys.REFRESH_TOKEN.description))
                    .then(refresh_token => authorizationService.refresh_token(address, refresh_token))
                return axios(error.config);
            }
            return Promise.reject(error);
        })
    }

    return {configure}

}

export default useUnauthorizedHttpInterceptorService;