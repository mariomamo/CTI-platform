import SideBar from "../../components/NavBar/SideBar.jsx";
import MainContentContainer from "./MainContentContainer.jsx";
import useTemplatePageHook from "./TemplatePageHook.jsx";
import _useWalletInfo from "../../../hooks/WalletInfoHook.jsx";
import _useAuthorizationService from "../../../services/AuthorizationServiceHook.jsx";
import PropTypes from "prop-types";
import {useNavigate as _useNavigate} from "react-router-dom";
import RouterPaths from "../../../enums/RoutesPaths.jsx";
import React from "react";

const TemplatePage = ({useWalletInfo, useAuthorizationService, useNavigate, children}) => {
    const templatePageHook = useTemplatePageHook();
    const walletInfo = useWalletInfo();
    const authorizationService = useAuthorizationService();
    const navigate = useNavigate();

    return (
        <div style={{height: "100vh"}}>
            <MainContentContainer templatePageHook={templatePageHook} walletAddress={walletInfo.walletAddress}
                                  logOut={authorizationService.logout} goToProfile={() => navigate(RouterPaths.PROFILE.description)}>
                {children}
            </MainContentContainer>
            <SideBar templatePageHook={templatePageHook}/>
        </div>
    )
}

TemplatePage.propTypes = {
    useWalletInfo: PropTypes.func,
    useAuthorizationService: PropTypes.func,
    useNavigate: PropTypes.func,
    children: PropTypes.object
};

TemplatePage.defaultProps = {
    useWalletInfo: _useWalletInfo,
    useAuthorizationService: _useAuthorizationService,
    useNavigate: _useNavigate,
    children: <div></div>
};

export default TemplatePage;
