import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AppWithReduxLoader from "./AppWithReduxLoader.jsx";
import WebStorageProvider from "./contexts/storage/WebStorageProvider.jsx";
import PlatformProvider from "./contexts/platform/PlatformProvider.jsx";
import Web3WalletProvider from "./contexts/web3Wallet/Web3WalletProvider.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <WebStorageProvider>
        <PlatformProvider>
            <Web3WalletProvider>
                <AppWithReduxLoader />
            </Web3WalletProvider>
        </PlatformProvider>
    </WebStorageProvider>
// </React.StrictMode>,
)
