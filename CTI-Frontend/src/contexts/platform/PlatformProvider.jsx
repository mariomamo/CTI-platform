import {createContext, useContext} from "react";
import {PlatformProviderService} from "../../services/PlatformProviderService/PlatformProviderService.jsx";

const PlatformProviderContext = createContext({});

const PlatformProvider = ({children})=> {
    const platformProviderService = new PlatformProviderService();

    return (
        <PlatformProviderContext.Provider value={platformProviderService}>
            {children}
        </PlatformProviderContext.Provider>
    )

}

export const usePlatform = ()=> {
    return useContext(PlatformProviderContext);
}

export default PlatformProvider;