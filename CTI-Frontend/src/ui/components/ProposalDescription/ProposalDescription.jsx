import React, {useEffect, useState} from "react";
import "./ProposalDescription.css";
import UpgradeTier from "../../UpgradeTier/UpgradeTier.jsx";

const ProposalDescription = ({title, description, startingVote, isLoading, fullAccess}) => {
    const skeletonClassName = "loading-skeleton";
    const defaultTitleClassName = "proposal-description-title";
    const defaultSubtitleClassName = "proposal-description-subtitle";
    const [titleClassName, setTitleClassName] = useState(`${defaultTitleClassName} ${skeletonClassName}`);
    const [subtitleClassName, setSubtitleClassName] = useState(`${defaultSubtitleClassName} ${skeletonClassName}`);

    useEffect(() => {
        if (title) {
            setTitleClassName(defaultTitleClassName);
        } else {
            setTitleClassName(`${defaultTitleClassName} ${skeletonClassName}`);
        }
    }, [title]);

    useEffect(() => {
        if (startingVote) {
            setSubtitleClassName(defaultSubtitleClassName);
        } else {
            setSubtitleClassName(`${defaultSubtitleClassName} ${skeletonClassName}`);
        }
    }, [startingVote]);

    return (
        <div>
            <h1 className={titleClassName} style={{"marginRight": "20px"}}>{title}</h1>
            <h3 className={subtitleClassName}>Submitted {startingVote}</h3>
            {isLoading ?
                <div>
                    <div className="loading-skeleton" style={{"display": "block", "marginTop": "10px"}}></div>
                    <div className="loading-skeleton" style={{"display": "block", "marginTop": "10px"}}></div>
                    <div className="loading-skeleton" style={{"display": "block", "marginTop": "10px"}}></div>
                    <div className="loading-skeleton" style={{"display": "block", "marginTop": "10px"}}></div>
                    <div className="loading-skeleton" style={{"display": "block", "marginTop": "10px"}}></div>
                    <div className="loading-skeleton" style={{"display": "block", "marginTop": "10px"}}></div>
                    <div className="loading-skeleton" style={{"display": "block", "marginTop": "10px"}}></div>
                    <div className="loading-skeleton" style={{"display": "block", "marginTop": "10px"}}></div>
                </div>
                :
                <p className="proposal-description-description">
                    {description}
                </p>
            }
        </div>
    )
}

export default ProposalDescription;