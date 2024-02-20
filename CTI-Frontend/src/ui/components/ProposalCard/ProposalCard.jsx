import "./ProposalCard.css";
import {Card, CardBody, CardTitle, Col, Container, Row} from "react-bootstrap";
import StatusBadge from "../StatusBadge/StatusBadge.jsx";
import {useEffect, useState} from "react";

const ProposalCard = ({id, title, status, startingVote, endingVote, onClick = ()=> {}})=> {
    const passed = status === "passed";
    const rejected = status === "rejected";
    const pending = status === "pending";

    const defaultIdClassName = "proposal-card-id";
    const skeletonClassName = "loading-skeleton";
    const [idClassName, setIdClassname] = useState(`${defaultIdClassName} ${skeletonClassName}`);
    const defaultCardClassName = "proposal-card-name";
    const [cardClassName, setCardClassName] = useState(`${defaultCardClassName} ${skeletonClassName}`);
    const votingInfoDefaultClassName = "proposal-card-voting-info-content";
    const [votingInfoClassName, setVotingInfoClassName] = useState(`${votingInfoDefaultClassName} ${skeletonClassName}`);

    useEffect(() => {
        if (id) {
            setIdClassname(defaultIdClassName);
        } else {
            setIdClassname(`${defaultIdClassName} ${skeletonClassName}`);
        }
    }, [id]);

    useEffect(() => {
        if (title) {
            setCardClassName(defaultCardClassName);
        } else {
            setCardClassName(`${defaultCardClassName} ${skeletonClassName}`);
        }
    }, [title]);

    useEffect(() => {
        if (startingVote && endingVote) {
            setVotingInfoClassName(defaultCardClassName);
        } else {
            setVotingInfoClassName(`${votingInfoDefaultClassName} ${skeletonClassName}`);
        }
    }, [startingVote, endingVote]);

    return (
        <Card className="proposal-card-container" onClick={onClick}>
            <CardBody style={{padding: 10}}>
                <Container>
                    <Row>
                        <Col className={idClassName}>#{id}</Col>
                        <Col>
                            <StatusBadge style={{display: "flex", float: "right"}} passed={passed} rejected={rejected} pending={pending}/>
                        </Col>
                    </Row>
                    <Row>
                        <CardTitle className={cardClassName}>{title}</CardTitle>
                    </Row>
                    <Row className="proposal-card-voting-info-header">
                        <Col xxl={6} xs={6}>Voting started</Col>
                        <Col xxl={6} xs={6}>Voting deadline</Col>
                    </Row>
                    <Row className={votingInfoClassName}>
                        <Col xxl={6} xs={6}>{startingVote}</Col>
                        <Col xxl={6} xs={6}>{endingVote}</Col>
                    </Row>
                </Container>
            </CardBody>
        </Card>
    )
}

export default ProposalCard;