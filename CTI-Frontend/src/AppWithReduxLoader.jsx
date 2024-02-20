import {useEffect, useState} from "react";
import {useStorage} from "./contexts/storage/WebStorageProvider.jsx";
import configureStorage from "./services/Redux/configureStorage.jsx";
import throttle from "lodash/throttle.js";
import StorageKeys from "./enums/StorageKeys.jsx";
import {Provider} from "react-redux";
import App from "./App.jsx";
import {HashRouter as Router} from "react-router-dom";

const AppWithReduxLoader = () => {
    const [store, setStore] = useState();
    const [isStoreLoaded, setStoreLoaded] = useState(false);
    const storageService = useStorage();

    useEffect(() => {
        // Enable serializing BigInt
        BigInt.prototype.toJSON = function () {
            const int = Number.parseInt(this.toString());
            return int ?? this.toString();
        };

        configureStorage(storageService)
            .then(store => {
                store.subscribe(throttle(() => {
                    storageService.set(StorageKeys.GLOBAL_STORAGE.description, JSON.stringify(store.getState()));
                }))
                setStore(store);
                setStoreLoaded(true);
            })
    }, [])

    return (
        <>
            {isStoreLoaded && (
                <Provider store={store}>
                    <Router>
                        <App />
                    </Router>
                </Provider>
            )}
        </>
    )
}

export default AppWithReduxLoader;