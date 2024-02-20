import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import SidebarMainNavbar from "./SidebarMainNavbar.jsx";
import SidebarSearch from "./SidebarSearch.jsx";
import SidebarNavItems from "./SidebarNavItems.jsx";

// import { Store } from "../../../flux";
import Col from "../../shard-dashboard/container/Col.jsx";

const MainSidebar = ({hideLogoText, mainSidebarOpenClassName})=> {
  //TODO: Rivedere
  // this.state = {
  //   menuVisible: false,
    // sidebarNavItems: Store.getSidebarItems()
  // };

  // componentWillMount() {
  //   // Store.addChangeListener(this.onChange);
  // }
  //
  // componentWillUnmount() {
  //   // Store.removeChangeListener(this.onChange);
  // }
  //
  // onChange() {
  //   // this.setState({
  //   //   ...this.state,
  //   //   menuVisible: Store.getMenuState(),
  //   //   sidebarNavItems: Store.getSidebarItems()
  //   // });
  // }

  const classes = classNames(
    "main-sidebar",
    "px-0",
    "col-12",
    mainSidebarOpenClassName,
  );

  return (
    <Col
      tag="aside"
      className={classes}
      lg={{ size: 2 }}
      md={{ size: 3 }}
    >
      <SidebarMainNavbar hideLogoText={hideLogoText} />
      <SidebarSearch />
      <SidebarNavItems />
    </Col>
  );
}

MainSidebar.propTypes = {
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool
};

MainSidebar.defaultProps = {
  hideLogoText: false
};

export default MainSidebar;
