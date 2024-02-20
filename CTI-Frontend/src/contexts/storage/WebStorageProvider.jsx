import {createContext, useContext} from "react";
import {WebStorageService} from "../../services/StorageService/WebStorageService.jsx";

const WebStorageContext = createContext({});

const WebStorageProvider = ({children})=> {
    const storageService = new WebStorageService();

    return (
        <WebStorageContext.Provider value={storageService}>
            {children}
        </WebStorageContext.Provider>
    )

}

export const useStorage = ()=> {
    return useContext(WebStorageContext);
}

export default WebStorageProvider;