import ContentContainer from "./ContentContainer.jsx";
import TopBar from "../../components/TopBar/TopBar.jsx";

const MainContentContainer = ({templatePageHook, walletAddress, logOut, goToProfile, children}) => {

    return (
        <main className="main-content col-lg-10 col-md-9 col-sm-12 p-0 offset-lg-2 offset-md-3" style={{height: "100%", display: "flex", flexFlow: "column"}}>
            <TopBar templatePageHook={templatePageHook} walletAddress={walletAddress} logOut={logOut} goToProfile={goToProfile}/>
            <ContentContainer>
                {children}
            </ContentContainer>
        </main>
    )
}

export default MainContentContainer;