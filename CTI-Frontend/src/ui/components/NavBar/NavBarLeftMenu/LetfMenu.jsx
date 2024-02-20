import {NavLink} from "react-router-dom";
const NavBarLeftMenu = ({templatePageHook})=> {
    return (
        <div className="nav-wrapper">
            <ul className="nav flex-column">
                <NavLink to={RouterPaths.PROFILE.description} className="nav-item pointer-cursor" onClick={templatePageHook.handleSandwichClick} style={{ textDecoration: 'none' }}>
                    <div className="nav-link">
                        <i className="material-icons">person</i>
                        <span>Profile</span>
                    </div>
                </NavLink>
                <NavLink to={RouterPaths.DAO.description} className="nav-item pointer-cursor" onClick={templatePageHook.handleSandwichClick} style={{ textDecoration: 'none' }}>
                    <div className="nav-link ">
                        <i className="material-icons">poll</i>
                        <span>DAO</span>
                    </div>
                </NavLink>
                <NavLink to={RouterPaths.GOVERNANCE.description} className="nav-item pointer-cursor" onClick={templatePageHook.handleSandwichClick} style={{ textDecoration: 'none' }}>
                    <div className="nav-link ">
                        <i className="material-icons">account_balance</i>
                        <span>Governance</span>
                    </div>
                </NavLink>
                <NavLink to={RouterPaths.PRICING.description} className="nav-item pointer-cursor" onClick={templatePageHook.handleSandwichClick} style={{ textDecoration: 'none' }}>
                    <div className="nav-link ">
                        <i className="material-icons">paid</i>
                        <span>Pricing</span>
                    </div>
                </NavLink>
                <NavLink to={RouterPaths.AIRDROP.description} className="nav-item pointer-cursor" onClick={templatePageHook.handleSandwichClick} style={{ textDecoration: 'none' }}>
                    <div className="nav-link ">
                        <i className="material-icons">redeem</i>
                        <span>Airdrop</span>
                    </div>
                </NavLink>
            </ul>
        </div>
    )
}

import RouterPaths from "../../../../enums/RoutesPaths.jsx";

export default NavBarLeftMenu;