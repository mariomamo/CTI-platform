import React from "react";

import Notifications from "./Notifications.jsx";
import UserActions from "./UserActions.jsx";
import Nav from "../../../shard-dashboard/nav/Nav.jsx";

export default () => (
  <Nav navbar className="border-left flex-row">
    <Notifications />
    <UserActions />
  </Nav>
);
