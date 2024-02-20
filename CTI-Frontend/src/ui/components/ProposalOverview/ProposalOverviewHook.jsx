import useCtiService from "../../../services/Web3/CtiServiceHook.jsx";
import {toast} from "react-hot-toast";
import {useEffect, useState} from "react";
import {CtiChoiceIndexes} from "../../../enums/CtiChoiceIndexes.jsx";
import classNames from "classnames";
import useCtiTokenService from "../../../services/Web3/CtiTokenServiceHook.jsx";
import TokenValues from "../../../services/Web3/TokenValues.jsx";
import useNumberFortmatterHook from "../../../services/NumberFortmatterHook.jsx";

const useProposalOverview = ({startingVote, endingVote, initialAccepted, initialRejected, initialAbstained, address}) => {
    const ctiService = useCtiService();
    const numberFormatter = useNumberFortmatterHook();
    const ctiTokenService = useCtiTokenService();
    const [accepted, setAccepted] = useState(initialAccepted);
    const [rejected, setRejected] = useState(initialRejected);
    const [abstained, setAbstained] = useState(initialAbstained);
    const [acceptedPercentage, setAcceptedPercentage] = useState(0);
    const [rejectedPercentage, setRejectedPercentage] = useState(0);
    const [abstainedPercentage, setAbstainedPercentage] = useState(0);
    const [isStartVoteLoading, setIsStartVoteLoading] = useState(!startingVote);
    const [isEndVoteLoading, setIsEndVoteLoading] = useState(!endingVote);
    const [isVoteInfoLoading, setIsVoteInfoLoading] = useState(true);
    const [isQuorumInfoLoading, setIsQuorumInfoLoading] = useState(true);
    const [isQuorumReached, setIsQuorumReached] = useState(false);
    const [quorum, setQuorum] = useState("- / -");
    const skeletonClassName = "loading-skeleton";

    const startingVoteClassName = classNames(
        isStartVoteLoading && skeletonClassName,
    )

    const endingVoteClassName = classNames(
        isEndVoteLoading && skeletonClassName,
    )

    const votingInfoClassName = classNames(
        "proposal-overview-voting-info",
        isVoteInfoLoading && skeletonClassName,
    )

    const quorumClassName = classNames(
        isQuorumInfoLoading && skeletonClassName,
    )

    const proposalActionsClassName = classNames(
        "proposal-overview-actions",
        isVoteInfoLoading && skeletonClassName
    )

    useEffect(() => {
        if (accepted !== undefined && rejected !== undefined && abstained !== undefined) {
            calculate_voting_percentages();
            calculate_quorum();
        }
    }, [accepted, rejected, abstained]);

    function calculate_voting_percentages() {
        const totalVote = accepted + rejected + abstained;
        if (accepted > 0) setAcceptedPercentage(Math.round((accepted / totalVote) * 100));
        else setAcceptedPercentage(0);
        if (rejected > 0) setRejectedPercentage(Math.round((rejected / totalVote) * 100));
        else setRejectedPercentage(0);
        if (abstained > 0) setAbstainedPercentage(Math.round((abstained / totalVote) * 100));
        else setAbstainedPercentage(0);
        setIsVoteInfoLoading(false);
    }

    function calculate_quorum() {
        ctiTokenService.getTotalSupply()
            .then(circulatingSupply => {
                circulatingSupply = Number(circulatingSupply) / TokenValues.ONE;
                let totalVotes = accepted + rejected + abstained;
                if (totalVotes > 0) totalVotes = totalVotes / TokenValues.ONE;
                setQuorum(`${numberFormatter.format(totalVotes)} / ${numberFormatter.format(circulatingSupply * 10 / 100)}`);
                setIsQuorumReached(totalVotes >= circulatingSupply * 10 / 100);
            })
            .catch(error => console.error(error))
            .finally(() => setIsQuorumInfoLoading(false));
    }

    useEffect(() => {
        setIsStartVoteLoading(!startingVote);
    }, [startingVote]);

    useEffect(() => {
        setIsEndVoteLoading(!startingVote);
    }, [endingVote]);

    useEffect(() => {
        if (initialAccepted !== undefined && initialRejected !== undefined && initialAbstained !== undefined) {
            setAccepted(initialAccepted);
            setRejected(initialRejected);
            setAbstained(initialAbstained);
        }
    }, [initialAccepted, initialRejected, initialAbstained]);

    const reloadData = () => {
        ctiService.getCti(address).then(cti => {
            setAccepted(Number(cti.voteAmounts[CtiChoiceIndexes.VALID.description]));
            setRejected(Number(cti.voteAmounts[CtiChoiceIndexes.INVALID.description]));
            setAbstained(Number(cti.voteAmounts[CtiChoiceIndexes.ABSTAIN.description]));
        })
    }

    const accept = () => {
        setIsVoteInfoLoading(true);
        ctiService.accept(address)
            .then(result => {
                // console.log(result);
                reloadData();
                toast.success("CTI voted!", {duration: 1500});
                setIsVoteInfoLoading(false);
            })
            .catch(error => {
                // console.error("error: ", error);
                toast.error("Error while voting", {duration: 1500});
                setIsVoteInfoLoading(false);
            });
    }
    const reject = () => {
        setIsVoteInfoLoading(true);
        ctiService.reject(address)
            .then(result => {
                // console.log(result);
                reloadData();
                toast.success("CTI voted!", {duration: 1500});
                setIsVoteInfoLoading(false);
            })
            .catch(error => {
                // console.error("error: ", error);
                toast.error("Error while voting", {duration: 1500});
                setIsVoteInfoLoading(false);
            });
    }

    const abstain = () => {
        setIsVoteInfoLoading(true);
        ctiService.abstain(address)
            .then(result => {
                // console.log(result);
                reloadData();
                toast.success("CTI voted!", {duration: 1500});
                setIsVoteInfoLoading(false);
            })
            .catch(error => {
                // console.error("error: ", error);
                toast.error("Error while voting", {duration: 1500});
                setIsVoteInfoLoading(false);
            });
    }

    return {
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
    }
}

export default useProposalOverview;