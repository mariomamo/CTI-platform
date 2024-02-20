import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useAuthorizationService from "../../../services/AuthorizationServiceHook.jsx";
import RouterPaths from "../../../enums/RoutesPaths.jsx";

const useNotLoggedHook = ()=> {
    const [shouldRender, setShouldRender] = useState(false);
    const navigate = useNavigate();
    const authorizationService = useAuthorizationService();

    useEffect(() => {
        authorizationService.isLogged()
            .then(() => navigate(RouterPaths.DASHBOARD.description))
            .catch(() => setShouldRender(true))
    }, [navigate])

    return {shouldRender}
}

export default useNotLoggedHook;