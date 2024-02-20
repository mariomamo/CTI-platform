const NavBarMain = ({templatePageHook})=> {
    return (
        <div className="main-navbar">
            <nav className="navbar align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0">
                <a className="navbar-brand w-100 mr-0" style={{lineHeight: "25px"}}>
                    <div className="d-table m-auto">
                        <img id="main-logo" className="d-inline-block align-top mr-1" style={{maxWidth: 25}}
                             src="./CTI/images/cti_logo.png" alt="Shards Dashboard"/>
                        <span className="d-none d-md-inline ml-1">CTI Dashboard</span>
                    </div>
                </a>
                <div className="toggle-sidebar d-sm-inline d-md-none d-lg-none pointer-cursor" onClick={templatePageHook.handleSandwichClick}>
                    <i className="material-icons"></i>
                </div>
            </nav>
        </div>
    )
}

export default NavBarMain;