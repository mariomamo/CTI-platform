const TopBarUserInfo =({templatePageHook, walletAddress, logout, goToProfile})=> {

    return (
        <ul className="navbar-nav border-left flex-row ">
            {/*<TopBarNotificationPopup templatePageHook={templatePageHook} />*/}
            <li className="nav-item dropdown pointer-cursor" onClick={templatePageHook.handleProfileMenuClick}>
                <a className="nav-link dropdown-toggle text-nowrap px-3" data-toggle="dropdown"
                   role="button" aria-haspopup="true" aria-expanded="false">
                    <img className="user-avatar rounded-circle mr-2"
                         src="./CTI/images/eth_profile_pic.png"
                         alt="User Avatar"/>
                    <span className="d-none d-md-inline-block">{walletAddress}</span>
                </a>
                <div className={"dropdown-menu dropdown-menu-small " + templatePageHook.profileMenuClassName} style={{right: "auto"}}>
                    <a className="dropdown-item" onClick={goToProfile}>
                        <i className="material-icons"></i>
                        Profile
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item text-danger" onClick={logout}>
                        <i className="material-icons text-danger"></i>
                        Logout
                    </a>
                </div>
            </li>
        </ul>
    )
}

export default TopBarUserInfo;