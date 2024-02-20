import StorageKeys from "../enums/StorageKeys.jsx";
import useWalletInfo from "../hooks/WalletInfoHook.jsx";
import {useNavigate} from "react-router-dom";
import RouterPaths from "../enums/RoutesPaths.jsx";
import {useStorage} from "../contexts/storage/WebStorageProvider.jsx";
import axios from "axios";

const _defaultBaseUrl = import.meta.env.VITE_AUTHORIZATION_SERVICE_BASE_URL;

const useAuthorizationService = (baseUrl = _defaultBaseUrl) => {
    const walletInfo = useWalletInfo();
    const navigate = useNavigate();
    const storageService = useStorage();
    const nonce_url = baseUrl + "/nonce";
    const login_url = baseUrl + "/login";
    const refresh_token_url = baseUrl + "/auth/refresh-jwt";

    const isLogged = () => {
        return new Promise((resolve, reject) => {
            storageService.get(StorageKeys.ACCESS_TOKEN.description)
                .then(res => checkStorageServiceResult(res, reject))
                .then(() => storageService.get(StorageKeys.REFRESH_TOKEN.description))
                .then(res => checkStorageServiceResult(res, reject))
                .then(() => resolve())
                .catch(error => reject(error))
        });
    }

    function checkStorageServiceResult(res, reject) {
        if (!res) reject();
    }

    const get_nonce = (address) => {
        const headers = {"Content-Type": "application/json"};
        return axios.get(`${nonce_url}/${address}`, {headers: headers})
            .then(response => response.data.nonce);
    }

    const login = (address, signed_message) => {
        const headers = {"Content-Type": "application/json"};
        return axios.post(login_url, {"address": address, "signature": signed_message}, {headers: headers})
            .then(response => save_access_token_and_refresh_token(response))
    }

    const refresh_token = (address, refresh_token) => {
        const headers = {"Content-Type": "application/json", "id": address, "refresh_token": refresh_token, "x-no-retry": true};
        return axios.post(refresh_token_url, {"id": address, "refresh_token": refresh_token}, {headers: headers})
            .then(response => save_access_token_and_refresh_token(response))
    }

    const save_access_token_and_refresh_token = (response) => {
        const body = JSON.parse(response.data.output);
        const access_token = body.jwt;
        const refresh_token = body.refresh_token
        storageService.set(StorageKeys.ACCESS_TOKEN.description, access_token);
        storageService.set(StorageKeys.REFRESH_TOKEN.description, refresh_token);
    }

    const logout = () => {
        return storageService.remove(StorageKeys.ACCESS_TOKEN.description)
            .then(() => storageService.remove(StorageKeys.REFRESH_TOKEN.description))
            .then(() => walletInfo.deleteState())
            .then(() => storageService.remove(StorageKeys.GLOBAL_STORAGE.description))
            .then(() => navigate(RouterPaths.LOGIN.description))
            .catch(error => error);
    }

    return {isLogged, logout, get_nonce, login, refresh_token}
}

export default useAuthorizationService;