import {useDispatch, useSelector} from "react-redux";
import WalletInfoReduxOperations from "../services/Redux/WalletInfoReduxOperations.jsx";
import WalletInfoReducerKeys from "../services/Redux/WalletInfoReducerKeys.jsx";
import ReduxReducersNames from "../services/Redux/ReduxReducersNames.jsx";

const useWalletInfo = () => {
    const dispatch = useDispatch();
    const walletInfo = useSelector(state => state[ReduxReducersNames.WALLET.description]);
    const walletAddress = walletInfo[WalletInfoReducerKeys.WALLET_ADDRESS.description];

    const setAddress = (new_address) => {
        return dispatch({
            type: WalletInfoReduxOperations.SET_WALLET_ADDRESS.description,
            payload: {[WalletInfoReducerKeys.WALLET_ADDRESS.description]: new_address}
        });
    }

    const deleteState = () => {
        dispatch({type: WalletInfoReduxOperations.DELETE_WALLET_INFO.description});
    }

    return {walletAddress, setAddress, deleteState}
}

export default useWalletInfo;