import {useState} from "react";

const useTopBarHook = ()=> {
    const [notificationNumber, setNotificationNumber] = useState(0);

    return {notificationNumber, setNotificationNumber}
}

export default useTopBarHook;