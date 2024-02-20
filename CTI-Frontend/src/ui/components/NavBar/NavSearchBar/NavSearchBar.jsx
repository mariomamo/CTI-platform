const NavSearchBar = ()=> {
    return (
        <form action="#" className="main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none">
            <div className="input-group input-group-seamless ml-3">
                <div className="input-group-prepend">
                    <div className="input-group-text">
                        <i className="fas fa-search"></i>
                    </div>
                </div>
                <input className="navbar-search form-control" type="text" placeholder="Search for something..."
                       aria-label="Search"/>
            </div>
        </form>
    )
}

export default NavSearchBar;