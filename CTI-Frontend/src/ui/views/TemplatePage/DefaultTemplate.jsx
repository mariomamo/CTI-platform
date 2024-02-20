import React from "react";
import PropTypes from "prop-types";

import MainNavbar from "../../components/layout/MainNavbar/MainNavbar.jsx";
import MainSidebar from "../../components/layout/MainSidebar/MainSidebar.jsx";
import MainFooter from "../../components/layout/MainFooter.jsx";
import Container from "../../components/shard-dashboard/container/Container.jsx";
import Row from "../../components/shard-dashboard/container/Row.jsx";
import Col from "../../components/shard-dashboard/container/Col.jsx";
import useTemplatePageHook from "./TemplatePageHook.jsx";

const DefaultTemplate = ({ children, noNavbar, noFooter }) => {
    const templatePageHook = useTemplatePageHook();

    return (
        <Container fluid>
            <Row>
                <MainSidebar mainSidebarOpenClassName={templatePageHook.mainSidebarOpenClassName}/>
                <Col
                    className="main-content p-0"
                    lg={{ size: 10, offset: 2 }}
                    md={{ size: 9, offset: 3 }}
                    sm="12"
                    tag="main"
                >
                    {!noNavbar && <MainNavbar onSandwichClick={templatePageHook.handleSandwichClick} />}
                    {children}
                    {!noFooter && <MainFooter />}
                </Col>
            </Row>
        </Container>
    )
}

DefaultTemplate.propTypes = {
    /**
     * Whether to display the navbar, or not.
     */
    noNavbar: PropTypes.bool,
    /**
     * Whether to display the footer, or not.
     */
    noFooter: PropTypes.bool
};

DefaultTemplate.defaultProps = {
    noNavbar: false,
    noFooter: false
};

export default DefaultTemplate;
