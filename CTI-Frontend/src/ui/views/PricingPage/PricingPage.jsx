import "./PricingPage.css";
import usePricingPage from "./PricingPageHook.jsx";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import PricingCard from "../../components/PricingCard/PricingCard.jsx";
import React from "react";
import LoadingOverlay from "../../LoadingOverlay/LoadingOverlay.jsx";
import SubscriptionPrices from "../../../services/Web3/SubscriptionPrices.jsx";

const PricingPage = () => {
    const {
        regularSelected,
        plusSelected,
        loadingData,
        regularBenefits,
        plusBenefits,
        address,
        tier,
        setAddress,
        regularPriceInCti,
        plusPriceInCti,
        selectRegularCard,
        selectPlusCard,
        activateSubscription,
        loadWalletAddress
    } = usePricingPage();

    return (
        <div className="pricing-page container">
            <div className="container-fluid">
                <div className="pricing-page-current-tier">
                    {tier ? (<h3>Your current tier is {tier}</h3>) : (<h3>You have not an active plan</h3>)}
                </div>
                <div className="container">
                    <Row>
                        {/*<Col xxl={4} xl={4} lg={4} md={6} sm={12}>*/}
                        {/*    <PricingCard onClick={activateFreeSubscription}*/}
                        {/*                 price={0}*/}
                        {/*                 free*/}
                        {/*                 selected={freeSelected}*/}
                        {/*                 benefits={freeBenefits}*/}
                        {/*                 isLoading={loadingData}/>*/}
                        {/*</Col>*/}
                        <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
                            <PricingCard onClick={selectRegularCard}
                                         priceInDollar={49.99}
                                         priceInCti={regularPriceInCti}
                                         regular
                                         selected={regularSelected}
                                         benefits={regularBenefits}
                                         isLoading={loadingData}/>
                        </Col>
                        <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
                            <PricingCard onClick={selectPlusCard}
                                         priceInDollar={99.99}
                                         priceInCti={plusPriceInCti}
                                         plus
                                         selected={plusSelected}
                                         benefits={plusBenefits}
                                         isLoading={loadingData}/>
                        </Col>
                    </Row>
                </div>
                <div className="pricing-page-address-selector-container">
                    <div>
                        <h1>Address to activate subscription to</h1>
                        <div className="pricing-page-address-bar">
                            <InputGroup className="pricing-page-input-group mb-3">
                                <Button className="btn" onClick={loadWalletAddress}>My wallet</Button>
                                {loadingData && <LoadingOverlay size={30}/>}
                                <Form.Control
                                    placeholder="Address"
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    value={address}
                                    onChange={(e) => setAddress(e.currentTarget.value)}
                                />
                                <Button className="btn" onClick={activateSubscription} disabled={!regularSelected && !plusSelected}>Subscribe</Button>
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricingPage;