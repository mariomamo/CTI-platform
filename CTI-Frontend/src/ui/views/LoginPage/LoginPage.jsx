import './LoginPage.css';
import Button from "../../components/Button/Button.jsx";
import useLoginPageHook from "./LoginPageHook.jsx";
import WalletProviderType from "../../../enums/WalletProviderType.jsx";

const LoginPage = ()=> {
    const {login, change_wallet_selection, metamaskWalletDivClass, coinbaseWalletDivClass} = useLoginPageHook();

    return (
        <div className="login-main-container">
            <div className="login-box">
                <div className="login-container">
                    <div className="img">
                        <img src="./CTI/images/cti_logo.png" />
                    </div>
                    <div className="login-content">
                        <form className="login-form" action="../../../../index.html">
                            <div className="metamask-logo"></div>
                            <h2 className="title">Welcome</h2>
                            <div className="centered-container">
                                <div className={metamaskWalletDivClass} onClick={() => change_wallet_selection(WalletProviderType.METAMASK.description)}>
                                    <div className="image metamask"></div>
                                    <div className="info">
                                        <div className="title">Metamask</div>
                                        <div className="subtitle">Using your mobile or browser extension</div>
                                    </div>
                                </div>
                            </div>
                            <div className="centered-container">
                                <div className={coinbaseWalletDivClass} onClick={() => change_wallet_selection(WalletProviderType.COINBASE.description)}>
                                    <div className="image coinbase"></div>
                                    <div className="info">
                                        <div className="title">Coinbase</div>
                                        <div className="subtitle">Using your mobile or browser extension</div>
                                    </div>
                                </div>
                            </div>
                            {/*<input type="submit" className="btn" value="Login" />*/}
                            <div className="centered-container">
                                <Button text="Login" onClick={login}/>
                            </div>
                        </form>
                    </div>
                </div>
                <script type="text/javascript" src="js/main.js"></script>
            </div>
        </div>
    )
}

export default LoginPage;