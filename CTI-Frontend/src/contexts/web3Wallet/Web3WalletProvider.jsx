import {createContext, useContext} from "react";
import Web3ClientProvider from "../../services/Web3/Web3ClientProvider.jsx";
import DefaultWalletOperations from "../../services/Web3/DefaultWalletOperations.jsx";
import {useStorage} from "../storage/WebStorageProvider.jsx";
import {usePlatform} from "../platform/PlatformProvider.jsx";

const Web3WalletContext = createContext({});

const Web3WalletProvider = ({children})=> {
    const defaultWalletOperations = new DefaultWalletOperations();
    const storageService = useStorage();
    const platformProviderService = usePlatform();
    const walletProvider = new Web3ClientProvider(defaultWalletOperations, storageService, platformProviderService);

    return (
        <Web3WalletContext.Provider value={walletProvider}>
            {children}
        </Web3WalletContext.Provider>
    )
}

export const useWalletProvider = ()=> {
    return useContext(Web3WalletContext);
}

export default Web3WalletProvider;