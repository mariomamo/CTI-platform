import useRequiresAuthHook from "./ProtectedRouteHook.jsx";

const ProtectedRoute = ({children})=> {
    const {isLoggedIn} = useRequiresAuthHook();
    return (
        isLoggedIn ? children : null
    )
}

export default ProtectedRoute;