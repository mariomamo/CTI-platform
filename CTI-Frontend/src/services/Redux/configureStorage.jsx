import {configureStore} from "@reduxjs/toolkit";
import {addAttackPatternReducer, walletInfoReducer} from "./Reducers.jsx";
import StorageKeys from "../../enums/StorageKeys.jsx";
import ReduxReducersNames from "./ReduxReducersNames.jsx";
import WalletInfoReducerKeys from "./WalletInfoReducerKeys.jsx";
import AttackPattern from "../../objects/cti/AttackPattern.jsx";

const configureStorage = async (storageService) => {

    const get_wallet_initialState = () => {
        return storageService.get(StorageKeys.GLOBAL_STORAGE.description)
            .then(store => {
                if (store) {
                    return JSON.parse(store)[ReduxReducersNames.WALLET.description];
                }
                return {
                    [WalletInfoReducerKeys.WALLET_ADDRESS.description]: "",
                }
            })
    }

    return configureStore({
        reducer: {
            [ReduxReducersNames.WALLET.description]: walletInfoReducer,
            [ReduxReducersNames.ATTACK_PATTERN_CTI.description]: addAttackPatternReducer
        },
        preloadedState: {
            [ReduxReducersNames.WALLET.description]: await get_wallet_initialState(),
            [ReduxReducersNames.ATTACK_PATTERN_CTI.description]: new AttackPattern()
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
    });
}

export default configureStorage;