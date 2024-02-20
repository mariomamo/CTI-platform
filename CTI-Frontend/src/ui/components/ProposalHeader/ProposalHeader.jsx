import StatusBadge from "../StatusBadge/StatusBadge.jsx";
import React, {useEffect, useState} from "react";
import "./ProposalHeader.css";

const ProposalHeader = ({id, status}) => {
    const skeletonClassName = "loading-skeleton";
    const [proposalIdClassName, setProposalIdClassName] = useState(`proposal-id ${skeletonClassName}`);

    useEffect(() => {
        if (id) {
            setProposalIdClassName("proposal-id");
        } else {
            setProposalIdClassName(`proposal-id ${skeletonClassName}`);
        }
    }, [id]);

    return (
        <div>
            <div className="proposal-header">
                <div className={proposalIdClassName}>
                    #{id}
                </div>
                {
                    status === "passed" && <StatusBadge passed/> ||
                    status === "rejected" && <StatusBadge rejected/> ||
                    status === "pending" && <StatusBadge pending/> ||
                    <StatusBadge/>
                }
            </div>
        </div>
    )
}

export default ProposalHeader;