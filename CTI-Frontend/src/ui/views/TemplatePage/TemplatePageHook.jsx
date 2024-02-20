import {useState} from "react";

const useTemplatePageHook = () => {
    const [mainSidebarOpenClassName, setMainSidebarOpenClassName] = useState("");
    const [profileMenuClassName, setProfileMenuClassName] = useState("");
    const [notificationBoxClassName, setNotificationBoxClassName] = useState("");

    const handleSandwichClick = () => mainSidebarOpenClassName === "" ? setMainSidebarOpenClassName("open") : setMainSidebarOpenClassName("");

    const handleProfileMenuClick = () => profileMenuClassName === "" ? setProfileMenuClassName("show") : setProfileMenuClassName("");

    const handleNotificationBoxClick = () => notificationBoxClassName === "" ? setNotificationBoxClassName("show") : setNotificationBoxClassName("")

    return {handleSandwichClick, handleProfileMenuClick, handleNotificationBoxClick, mainSidebarOpenClassName, profileMenuClassName, notificationBoxClassName}
}

export default useTemplatePageHook;