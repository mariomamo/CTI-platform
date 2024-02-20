import "./GovernancePage.css";

import useGovernancePage from "./GovernancePageHook.jsx";
import {Button, Card, CardBody, CardTitle} from "react-bootstrap";
import React from "react";
import LoadingOverlay from "../../LoadingOverlay/LoadingOverlay.jsx";

const GovernancePage = () => {
    const {withdraw, deposit, depositedToken, withdrawValue, setWithdrawValue, depositValue, setDepositValue, isLoading} = useGovernancePage();

    return (
        <div>
            <div style={{height: 150, margin: 20, marginBottom: 50, textAlign: "center"}}>
                <h2>Governance informations</h2>
                <h3>
                    Total CTI deposited by you:
                    <div className="governance-token-deposited-by-you">
                        {isLoading && <LoadingOverlay size={25}/>}
                        {depositedToken}
                    </div>
                </h3>
            </div>

            <div>
                <div>
                    <div style={{justifyContent: "center", display: "flex", marginBottom: 20}}>
                        <input type="text" style={{marginRight: 10}} value={withdrawValue} onChange={(e) => setWithdrawValue(e.currentTarget.value)}/>
                        <div className="governance-button-container">
                            {isLoading && <LoadingOverlay size={25}/>}
                            <Button className="btn" onClick={withdraw} >Withdraw</Button>
                        </div>
                    </div>
                    <div style={{justifyContent: "center", display: "flex"}}>
                        <input type="text" style={{marginRight: 10}} value={depositValue} onChange={(e) => setDepositValue(e.currentTarget.value)}/>
                        <div className="governance-button-container">
                            {isLoading && <LoadingOverlay size={25}/>}
                            <Button className="btn" onClick={deposit}>Deposit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GovernancePage;