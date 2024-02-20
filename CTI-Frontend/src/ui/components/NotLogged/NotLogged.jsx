import useNotLoggedHook from "./NotLoggedHook.jsx";

const NotLogged = ({children}) => {
    const {shouldRender} = useNotLoggedHook();

    return (
        shouldRender ? children : null
    )
}

export default NotLogged
