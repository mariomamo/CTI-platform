import {useEffect, useState} from "react";

const useFloatingSearchAndAddBar = ({isSearch, onAddClick, onSearchClick}) => {
    const searchBarDefaultWidth = 190;
    const [searchBarWidth, setSearchBarWidth] = useState(searchBarDefaultWidth);
    const searchBarDefaultClassName = "searchbar-input-search";
    const [searchBarClassName, setSearchBarClassName] = useState(searchBarDefaultClassName);
    const searchIconDefaultClassName = "searchbar-search-icon-container";
    const [searchIconClassName, setSearchButtonClassName] = useState(searchIconDefaultClassName);
    const addButtonDefaultClassName = "searchbar-add-button";
    const [addButtonClassName, setAddButtonClassName] = useState(addButtonDefaultClassName);

    useEffect(() => {
        setSearchButtonClassName(`${searchIconDefaultClassName} selected`);
    }, []);

    useEffect(() => {
        if (isSearch) showSearchBar();
        else hideSearchBar();
    }, [isSearch]);

    const hideSearchBar = () => {
        setSearchBarClassName(`${searchBarDefaultClassName} hidden`)
        setSearchBarWidth(0);
        setAddButtonClassName(`${addButtonDefaultClassName} selected`);
        setSearchButtonClassName(searchIconDefaultClassName);
        onAddClick();
    }

    const showSearchBar = () => {
        setSearchBarClassName(searchBarDefaultClassName)
        setSearchBarWidth(searchBarDefaultWidth);
        setAddButtonClassName(addButtonDefaultClassName);
        setSearchButtonClassName(`${searchIconDefaultClassName} selected`);
        onSearchClick();
    }

    return {searchBarWidth, searchBarClassName, addButtonClassName, searchIconClassName, hideSearchBar, showSearchBar}
}

export default useFloatingSearchAndAddBar;