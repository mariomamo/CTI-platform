import React, {useEffect, useState} from "react";
import UpgradeTier from "../UpgradeTier/UpgradeTier.jsx";
import "./OptionalParametersView.css";
import classNames from "classnames";

const OptionalParametersView = ({parameters, isLoading, fullAccess}) => {
    const [optionalParameters, setOptionalParameters] = useState({});

    const containerClass = classNames(
    "optional-parameters-container",
        isLoading && "loading-skeleton"
    );

    useEffect(() => {
        if (parameters) {
            delete parameters.description;
            setOptionalParameters(parameters);
        }
    }, [parameters]);

    return (
        <div>
            <h3>Other parameters</h3>
            <div className={containerClass}>
                {fullAccess ?
                    <pre>
                        {JSON.stringify(parameters, null, 2)}
                    </pre> :
                    <UpgradeTier/>
                }
            </div>
        </div>
    )
}

export default OptionalParametersView;