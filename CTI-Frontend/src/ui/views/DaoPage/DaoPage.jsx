import {Col, Row} from "react-bootstrap";
import useDaoHook from "./DaoPageHook.jsx";
import ProposalCard from "../../components/ProposalCard/ProposalCard.jsx";
import "./DaoPage.css";
import FloatingSearchAndAddBar from "../../components/SearchBar/FloatingSearchAndAddBar.jsx";
import AddCtiPage from "../AddCtiPage/AddCtiPage.jsx";
import NoDataFound from "../../components/NoDataFound/NoDataFound.jsx";

const DaoPage = () => {
    const {proposals, isAdd, handleProposalClick, onAddButtonClick, isLoadingProposal, searchCti, initData} = useDaoHook();

    const renderProposalCards = () => {
        if (isLoadingProposal) {
            return [...Array(8)].map((_, index) =>
                <Col key={index} xxl={3} xl={3} lg={4} md={6} sm={12}>
                    <ProposalCard />
                </Col>
            )
        } else if (proposals.length === 0) {
            return <NoDataFound />
        }
        else {
            return proposals.map((proposal, index) =>
                <Col key={index} xxl={3} xl={3} lg={4} md={6} sm={12}>
                    <ProposalCard id={proposal.id}
                                  title={proposal.title}
                                  status={proposal.status}
                                  startingVote={proposal.startingVote}
                                  endingVote={proposal.endingVote}
                                  onClick={() => handleProposalClick(proposal)}/>
                </Col>
            )
        }
    }

    return (
        <>
            <FloatingSearchAndAddBar isSearch={!isAdd} onAddClick={() => onAddButtonClick(true)} onSearchClick={() => onAddButtonClick(false)} onChange={searchCti}/>
            {isAdd ?
                <AddCtiPage onFinish={initData}/>
                :
                (
                    <div className="proposals-container">
                        <Row className="proposal-container-row">
                            {renderProposalCards()}
                        </Row>
                    </div>
                )
            }
        </>
    )
}

export default DaoPage;