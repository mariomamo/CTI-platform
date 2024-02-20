import {useNavigate} from "react-router-dom";
import RoutesPaths from "../../../../enums/RoutesPaths.jsx";
import {Col, Row} from "react-bootstrap";
import "./ProposalPage.css";
import React, {useEffect} from "react";
import ProposalHeader from "../../../components/ProposalHeader/ProposalHeader.jsx";
import ProposalOverview from "../../../components/ProposalOverview/ProposalOverview.jsx";
import ProposalDescription from "../../../components/ProposalDescription/ProposalDescription.jsx";
import OptionalParametersView from "../../../OptionalParametersView/OptionalParametersView.jsx";
import NoDataFound from "../../../components/NoDataFound/NoDataFound.jsx";
import Forbidden from "../../../components/Forbidden/Forbidden.jsx";

const ProposalPage = ({ctiProposal, isLoading, fullAccess, unauthorizedError, notFoundError, navigate = useNavigate()}) => {

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: "instant"});
    }, [])

    return (
        <div className="proposal-container">
            <div className="back-arrow-container">
                <div className="back-arrow" onClick={() => navigate(RoutesPaths.DAO.description)}>
                    <i className="material-icons">arrow_back_ios</i>
                    BACK TO PROPOSALS
                </div>
            </div>
            <div>
                {!unauthorizedError && !notFoundError &&
                    <div>
                        <ProposalHeader id={ctiProposal.id} description={ctiProposal.description}
                                        status={ctiProposal.status}/>
                        <Row>
                            <Col lg={7}>
                                <ProposalDescription title={ctiProposal.title} description={ctiProposal.description}
                                                     startingVote={ctiProposal.startingVote} isLoading={isLoading} fullAccess={fullAccess}/>
                                <OptionalParametersView parameters={ctiProposal.optionalParameters}
                                                        isLoading={isLoading} fullAccess={fullAccess}/>
                            </Col>
                            <Col>
                                <ProposalOverview startingVote={ctiProposal.startingVote}
                                                  endingVote={ctiProposal.endingVote} initialAccepted={ctiProposal.accepted}
                                                  initialRejected={ctiProposal.rejected} initialAbstained={ctiProposal.abstained}
                                                  address={ctiProposal.address}/>
                            </Col>
                        </Row>
                    </div>
                }
                {unauthorizedError && <Forbidden/>}
                {notFoundError && <NoDataFound/>}
            </div>

        </div>
    )
}

export default ProposalPage;