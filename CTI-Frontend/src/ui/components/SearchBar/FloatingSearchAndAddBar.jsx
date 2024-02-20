import "./FloatingSearchAndAddBar.css";
import useFloatingSearchAndAddBar from "./FloatingSearchAndAddBarHook.jsx";

const FloatingSearchAndAddBar = ({isSearch, onAddClick, onSearchClick, onChange}) => {
    const {searchBarWidth, searchBarClassName, addButtonClassName, searchIconClassName, hideSearchBar, showSearchBar} = useFloatingSearchAndAddBar({isSearch, onAddClick, onSearchClick});

    return (
        <div className="searchbar-main-container">
            <div className="searchbar-container">
                <div className={searchIconClassName} onClick={showSearchBar}>
                    <img className="searchbar-search-icon" src="./CTI/images/search.png" alt="Search icon"/>
                </div>
                <input className={searchBarClassName} style={{width: `${searchBarWidth}px`}} type="text" placeholder="Search CTIs" onChange={(e) => onChange(e.currentTarget.value)}/>
                <div className={addButtonClassName} onClick={hideSearchBar}>
                    add
                </div>
            </div>
        </div>
    )
}

export default FloatingSearchAndAddBar;