import React from "react";

import SidebarNavItem from "./SidebarNavItem.jsx";
// import { Store } from "../../../flux";
import Nav from "../../shard-dashboard/nav/Nav.jsx";

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props)

    //TODO: Rivedere
    this.state = {
      navItems: [
        {
          title: "Profile",
          to: "/blog-overview",
          htmlBefore: '<i class="material-icons">edit</i>',
          htmlAfter: ""
        },
        {
          title: "DAO",
          htmlBefore: '<i class="material-icons">vertical_split</i>',
          to: "/blog-posts",
        },
        {
          title: "Airdrop",
          htmlBefore: '<i class="material-icons">note_add</i>',
          to: "/add-new-post",
        }
      ]
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    // Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    // Store.removeChangeListener(this.onChange);
  }

  onChange() {
    // this.setState({
    //   ...this.state,
    //   navItems: Store.getSidebarItems()
    // });
  }

  render() {
    const { navItems: items } = this.state;
    return (
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {items.map((item, idx) => (
            <SidebarNavItem key={idx} item={item} />
          ))}
        </Nav>
      </div>
    )
  }
}

export default SidebarNavItems;
