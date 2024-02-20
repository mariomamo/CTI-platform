import './App.css'
import LoginPage from "./ui/views/LoginPage/LoginPage.jsx";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ui/components/ProtectedRoute/ProtectedRoute.jsx";
import {Toaster} from "react-hot-toast";
import TemplatePage from "./ui/views/TemplatePage/TemplatePage.jsx";
import RoutesPaths from "./enums/RoutesPaths.jsx";
import DaoPage from "./ui/views/DaoPage/DaoPage.jsx";
import Airdrop from "./ui/views/Airdrop/Airdrop.jsx";
import React from "react";
import UserProfile from "./ui/views/UserProfile/UserProfile.jsx";
import ProposalPage from "./ui/views/DaoPage/ProposalPage/ProposalPage.jsx";
import NotLogged from "./ui/components/NotLogged/NotLogged.jsx";
import WithLoadProposal from "./ui/views/DaoPage/LoadProposalHoc.jsx";
import "./ui/components/skeleton/skeleton.css";
import GovernancePage from "./ui/views/GovernancePage/GovernancePage.jsx";
import PricingPage from "./ui/views/PricingPage/PricingPage.jsx";
import useUnauthorizedHttpInterceptorService from "./services/UnauthorizedHttpInterceptorService.jsx";

function App() {

    useUnauthorizedHttpInterceptorService();

    const protectedRoute = (component) => {
        return <ProtectedRoute>{component}</ProtectedRoute>
    }

    const templatePage = (component) => {
        return protectedRoute(<TemplatePage>{component}</TemplatePage>)
    }

    const notLogged = (component) => {
        return <NotLogged>{component}</NotLogged>
    }

    return (
        <>
            <Routes>
                <Route path="" element={notLogged(<LoginPage/>)}/>
                <Route path={RoutesPaths.LOGIN.description} element={notLogged(<LoginPage/>)}/>
                <Route path={RoutesPaths.DASHBOARD.description} element={templatePage(<UserProfile/>)}/>
                <Route path={RoutesPaths.PROFILE.description} element={templatePage(<UserProfile/>)}/>
                <Route path={RoutesPaths.DAO.description} element={templatePage(<DaoPage/>)}/>
                <Route path={RoutesPaths.PROPOSAL.description + "/:address"}
                       element={templatePage(<WithLoadProposal WrappedComponent={ProposalPage}/>)}/>
                <Route path={RoutesPaths.GOVERNANCE.description} element={templatePage(<GovernancePage/>)}/>
                <Route path={RoutesPaths.PRICING.description} element={templatePage(<PricingPage/>)}/>
                <Route path={RoutesPaths.AIRDROP.description} element={templatePage(<Airdrop/>)}/>
                <Route path="*" element={templatePage(<UserProfile/>)}/>
            </Routes>
            <Toaster/>
        </>
    )
}

export default App
