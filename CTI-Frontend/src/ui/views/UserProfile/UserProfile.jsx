import React from "react";

import Container from "../../components/shard-dashboard/container/Container.jsx";
import Row from "../../components/shard-dashboard/container/Row.jsx";
import Col from "../../components/shard-dashboard/container/Col.jsx";

import PageTitle from "../../components/common/PageTitle.jsx";
import UserDetails from "../../components/user-profile-lite/UserDetails.jsx";
import _useWalletInfo from "../../../hooks/WalletInfoHook.jsx";
import SmallStats from "../../components/common/SmallStats.jsx";
import PropTypes from "prop-types";
import {Chart, registerables} from "chart.js";
import useUserProfileHook from "./UserProfileHook.jsx";
import LoadingOverlay from "../../LoadingOverlay/LoadingOverlay.jsx";

Chart.register(...registerables);

const UserProfile = ({useWalletInfo}) => {
    const walletInfo = useWalletInfo();
    const {
        smallStats,
        daysFromSubscription,
        daysFromSubscriptionInPercentage,
        isLoading
    } = useUserProfileHook();

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="User Profile" subtitle="Overview" md="12" className="ml-sm-auto mr-sm-auto"/>
            </Row>
            <Row>
                <Col lg="12">
                    <UserDetails userDetails={{
                        name: walletInfo.walletAddress,
                        avatar: "./CTI/images/eth_profile_pic.png",
                        daysFromSubscription: daysFromSubscription,
                        daysFromSubscriptionInPercentage: daysFromSubscriptionInPercentage,
                    }} isLoading={isLoading}/>
                </Col>
                {/*<Col lg="8">*/}
                {/*    <UserAccountDetails />*/}
                {/*</Col>*/}
            </Row>
            <Row>
                {smallStats.map((stats, idx) => (
                    <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
                        <SmallStats
                            id={`small-stats-${idx}`}
                            variation="1"
                            chartData={stats.datasets}
                            chartLabels={stats.chartLabels}
                            label={stats.label}
                            value={stats.value}
                            percentage={stats.percentage}
                            increase={stats.increase}
                            decrease={stats.decrease}
                            isLoading={isLoading}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

UserProfile.propTypes = {
    useWalletInfo: PropTypes.func
};

UserProfile.defaultProps = {
    useWalletInfo: _useWalletInfo
};

export default UserProfile;
