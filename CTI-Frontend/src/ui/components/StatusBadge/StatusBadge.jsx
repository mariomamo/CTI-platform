import classNames from "classnames";
import "./StatusBadge.css";
import {useEffect} from "react";

const StatusBadge = ({passed=false, rejected=false, pending=false, style})=> {
    const skeletonClassName = !passed && !rejected && !pending ? "loading-skeleton" : "";
    const status = passed ? "passed" : rejected ? "rejected" : pending ? "pending" : "";
    const cardStatusClass = classNames(
        "status-badge",
        status,
        skeletonClassName
    );

    return (
        <div style={style} className={cardStatusClass}>{status}</div>
    )
}

export default StatusBadge;