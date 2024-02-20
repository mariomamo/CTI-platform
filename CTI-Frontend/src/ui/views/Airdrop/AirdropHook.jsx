import _airdropService from "../../../services/Web3/AirdropServiceHook.jsx";
import {toast} from "react-hot-toast";
import {useState} from "react";

const useAirdropHook = (useAirdropService=_airdropService) => {
    const airdropService = useAirdropService();
    const [isLoading, setIsLoading] = useState(false)

    const claimTokens = () => {
        if (isLoading) return;
        setIsLoading(true);
        return airdropService.claim()
            .then(result => {
                toast.success("Claim completed!", {duration: 1000});
                setIsLoading(false);
            })
            .catch(error => {
                toast.error("You are not elegible for claim tokens", {duration: 3000});
                setIsLoading(false);
            });
    }

    return {claimTokens, isLoading}
}

export default useAirdropHook;