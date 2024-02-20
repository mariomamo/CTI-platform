import {useEffect, useState} from "react";
import useAuthorizationService from "../../../services/AuthorizationServiceHook.jsx";
import {useNavigate} from "react-router-dom";
import RouterPaths from "../../../enums/RoutesPaths.jsx";

const useRequiresAuthHook = ()=> {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const authorizationService = useAuthorizationService();

    useEffect(() => {
        authorizationService.isLogged()
            .then(() => setIsLoggedIn(true))
            .catch(() => navigate(RouterPaths.LOGIN.description));
    }, [navigate])

    return {isLoggedIn}
}

export default useRequiresAuthHook;