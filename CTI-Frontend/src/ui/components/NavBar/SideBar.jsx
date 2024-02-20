import "./NavBar.css";
import NavBarLeftMenu from "./NavBarLeftMenu/LetfMenu.jsx";
import NavSearchBar from "./NavSearchBar/NavSearchBar.jsx";
import NavBarMain from "./NavBarMain/NavBarMain.jsx";

const SideBar = ({templatePageHook})=> {

    return (
        <aside className={"main-sidebar col-12 col-md-3 col-lg-2 px-0 " + templatePageHook.mainSidebarOpenClassName}>
            <NavBarMain templatePageHook={templatePageHook}/>
            {/*<NavSearchBar />*/}
            <NavBarLeftMenu templatePageHook={templatePageHook} />
        </aside>
    )
}

export default SideBar;