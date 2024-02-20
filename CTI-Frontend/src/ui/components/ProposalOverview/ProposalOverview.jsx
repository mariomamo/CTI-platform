import VotingProgressbar from "../VotingProgressbar/VotingProgressbar.jsx";
import {Button, Col, Row} from "react-bootstrap";
import React from "react";
import "./ProposalOverview.css";
import useProposalOverview from "./ProposalOverviewHook.jsx";

const ProposalOverview = ({startingVote, endingVote, initialAccepted, initialRejected, initialAbstained, address}) => {
    const {
        acceptedPercentage,
        rejectedPercentage,
        abstainedPercentage,
        accept,
        reject,
        abstain,
        isQuorumReached,
        quorum,
        startingVoteClassName,
        endingVoteClassName,
        votingInfoClassName,
        quorumClassName,
        proposalActionsClassName
    } = useProposalOverview({startingVote, endingVote, initialAccepted, initialRejected, initialAbstained, address});

    return (
        <div>
            <h4 className="proposal-overview-title">Proposal Overview</h4>
            <div className={votingInfoClassName}>
                <VotingProgressbar style={{marginBottom: 20}} yes={acceptedPercentage} no={rejectedPercentage}/>
                {/*<div className="proposal-overview-deposited-tokens">*/}
                {/*    <img alt="token-logo" className="proposal-overview-token-logo" src="./CTI/images/ethereum_x64.png"/>*/}
                {/*    1.500.00 ETH*/}
                {/*</div>*/}
                <Row>
                    <Col>
                        <div>
                            <div>
                                <span className="proposal-page-dot approved"></span>
                                Yes
                            </div>
                            <div>{acceptedPercentage}%</div>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div>
                                <span className="proposal-page-dot rejected"></span>
                                No
                            </div>
                            <div>{rejectedPercentage}%</div>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div>
                                <span className="proposal-page-dot abstained"></span>
                                Abstained
                            </div>
                            <div>{abstainedPercentage}%</div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="proposal-overview-info">
                {/*<Row>*/}
                {/*    <Col>*/}
                {/*        Total Deposit*/}
                {/*    </Col>*/}
                {/*    <Col>*/}
                {/*        5,000 ETH*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row>
                    <Col>
                        Voting Started
                    </Col>
                    <Col className={startingVoteClassName}>
                        {startingVote}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Voting Deadline
                    </Col>
                    <Col className={endingVoteClassName}>
                        {endingVote}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Quorum
                    </Col>
                    <Col className={quorumClassName}>
                        {quorum}
                    </Col>
                </Row>
            </div>
            <div className={proposalActionsClassName}>
                <Button className="btn btn-danger" onClick={reject}>Invalid</Button>
                <Button className="btn btn-dark" onClick={abstain}>Abstain</Button>
                <Button className="btn btn-success" onClick={accept}>Valid</Button>
            </div>
        </div>
    )
}

export default ProposalOverview;