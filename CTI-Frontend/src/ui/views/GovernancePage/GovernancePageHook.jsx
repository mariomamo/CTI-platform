import useCtiGovernanceService from "../../../services/Web3/CtiGovernanceServiceHook.jsx";
import useCtiTokenService from "../../../services/Web3/CtiTokenServiceHook.jsx";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import TokenValues from "../../../services/Web3/TokenValues.jsx";

const useGovernancePage = () => {
    const ctiGovernanceService = useCtiGovernanceService();
    const ctiTokenService = useCtiTokenService();
    const [depositedToken, setDepositedToken] = useState(0);
    const [withdrawValue, setWithdrawValue] = useState(0);
    const [depositValue, setDepositValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        get_deposited_token()
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    }, []);

    function get_deposited_token() {
        return ctiGovernanceService.getDepositedTokens()
            .then(depositedToken => {
                setDepositedToken(Number(depositedToken) / TokenValues.ONE);
            })
    }

    const withdraw = () => {
        if (isLoading) return;
        setIsLoading(true);
        const valueToWithdraw = depositValue * TokenValues.ONE;
        ctiGovernanceService.withdrawTokens(valueToWithdraw)
            .then(() => get_deposited_token())
            .then(() => {
                toast.success(`${valueToWithdraw} tokens withdrawed`, {duration: 1500});
                setWithdrawValue(0);
                setIsLoading(false);
            })
            .catch(() => {
                toast.error(`Error while withdrawing ${valueToWithdraw} tokens`, {duration: 1500});
                setIsLoading(false);
            });
    }

    const deposit = () => {
        if (isLoading) return;
        setIsLoading(true);
        const valueToDeposit = depositValue * TokenValues.ONE;
        ctiTokenService.approve(ctiGovernanceService.ctiGovernanceContractAddress, valueToDeposit)
            .then(() => ctiGovernanceService.depositToken(valueToDeposit))
            .then(() => get_deposited_token())
            .then(() => {
                toast.success(`${valueToDeposit / TokenValues.ONE} tokens deposited`, {duration: 1500});
                setDepositValue(0);
                setIsLoading(false);
            })
            .catch(error => {
                // console.log("error: ", error);
                toast.error(`Error while depositing ${depositValue} tokens`, {duration: 1500});
                setIsLoading(false);
            })
    }

    return {
        withdraw,
        deposit,
        depositedToken,
        setWithdrawValue,
        withdrawValue,
        setDepositValue,
        depositValue,
        isLoading
    }
}

export default useGovernancePage;