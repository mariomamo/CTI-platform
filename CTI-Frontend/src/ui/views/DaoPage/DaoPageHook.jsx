import {useEffect, useState} from "react";
import RouterPaths from "../../../enums/RoutesPaths.jsx";
import {useNavigate} from "react-router-dom";
import useCtiFactoryService from "../../../services/Web3/CtiFactoryService.jsx";
import useAttackPatternHook from "../../../hooks/AttackPatternHook.jsx";

const useDaoHook = ()=> {
    const [isAdd, setIsAdd] = useState(false);
    const navigate = useNavigate();
    const [originalProposals, setOriginalProposals] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [isLoadingProposal, setIsLoadingProposal] = useState(true);
    const ctiFactoryService = useCtiFactoryService();
    const attackPatternHook = useAttackPatternHook();

    useEffect(() => {
        initData();
    }, []);

    const initData = () => {
        setIsAdd(false);
        setIsLoadingProposal(true);
        attackPatternHook.deleteState();
        ctiFactoryService.getAllCtis()
            .then(result => {
                setIsLoadingProposal(false);
                setOriginalProposals(result);
                setProposals(result);
            })
            .catch(error => setIsLoadingProposal(false));
    }

    const onAddButtonClick = (isAdd) => {
        setIsAdd(isAdd);
    }

    const handleProposalClick = (selectedProposal)=> {
        navigate(RouterPaths.PROPOSAL.description + "/" + selectedProposal.address)
    }

    const searchCti = (name) => {
        setProposals(originalProposals.filter(proposal => proposal.title.toLowerCase().includes(name.toLowerCase())));
    }

    return {proposals, isAdd, handleProposalClick, onAddButtonClick, isLoadingProposal, searchCti, initData}
}

export default useDaoHook;