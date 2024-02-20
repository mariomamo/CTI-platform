import './TopBar.css';
import TopBarSandwich from "./TopBarSandwich/TopBarSandwitch.jsx";
import TopBarUserInfo from "./TopBarUserInfo/TopBarUserInfo.jsx";
import TopSearchBar from "./TopSearchBar/TopSearchBar.jsx";

const TopBar = ({templatePageHook, walletAddress, logOut, goToProfile})=> {

    return (
        <div className="main-navbar sticky-top bg-white">
            <nav className="navbar align-items-stretch navbar-light flex-md-nowrap p-0">
                {/*<TopSearchBar />*/}
                <TopBarUserInfo templatePageHook={templatePageHook} walletAddress={walletAddress} logout={logOut} goToProfile={goToProfile}/>
                <TopBarSandwich templatePageHook={templatePageHook} />
            </nav>
        </div>
    )
}

export default TopBar;