import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import NavbarSearch from "./NavbarSearch.jsx";
import NavbarNav from "./NavbarNav/NavbarNav.jsx";
import NavbarToggle from "./NavbarToggle.jsx";
import Container from "../../shard-dashboard/container/Container.jsx";
import Navbar from "../../shard-dashboard/navbar/Navbar.jsx";

const MainNavbar = ({ layout, stickyTop, onSandwichClick}) => {
  const classes = classNames(
    "main-navbar",
    "bg-white",
    stickyTop && "sticky-top"
  );

  return (
    <div className={classes}>
      <Container fluid className="p-0">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          <NavbarSearch />
          <NavbarNav />
          <NavbarToggle onSandwichClick={onSandwichClick}/>
        </Navbar>
      </Container>
    </div>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
  stickyTop: true
};

export default MainNavbar;
