const TopBarSandwitch = ({templatePageHook})=> {
    return (
        <nav className="nav custom-topbar-nav pointer-cursor">
            <a className="nav-link nav-link-icon toggle-sidebar d-md-inline d-lg-none text-center border-left"
               data-toggle="collapse" data-target=".header-navbar" aria-expanded="false"
               aria-controls="header-navbar" onClick={templatePageHook.handleSandwichClick}>
                <i className="material-icons"></i>
            </a>
        </nav>
    )
}

export default TopBarSandwitch;