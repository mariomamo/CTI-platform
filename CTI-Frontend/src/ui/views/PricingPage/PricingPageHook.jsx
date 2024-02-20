import {useEffect, useState} from "react";
import useCtiUserService from "../../../services/Web3/CtiUserServiceHook.jsx";
import useCtiTokenService from "../../../services/Web3/CtiTokenServiceHook.jsx";
import {toast} from "react-hot-toast";
import {SubscriptionTierIndexes} from "../../../enums/SubscriptionTierIndexes.jsx";
import {useWalletProvider} from "../../../contexts/web3Wallet/Web3WalletProvider.jsx";
import {SubscriptionTierDescription} from "../../../enums/SubscriptionTierDescription.jsx";
import useOracleServiceHook from "../../../services/Web3/OracleService.jsx";
import SubscriptionPrices from "../../../services/Web3/SubscriptionPrices.jsx";
import TokenValues from "../../../services/Web3/TokenValues.jsx";

const usePricingPage = () => {

    const ctiTokenService = useCtiTokenService();
    const ctiUserService = useCtiUserService();
    const walletProvider = useWalletProvider();
    const oracleService = useOracleServiceHook();

    const [regularSelected, setRegularSelected] = useState(false);
    const [plusSelected, setPlusSelected] = useState(false);
    const [address, setAddress] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [tier, setTier] = useState("");
    const [tierIndex, setTierIndex] = useState(0);
    const [regularPriceInCti, setRegularPriceInCti] = useState(0);
    const [plusPriceInCti, setPlusPriceInCti] = useState(0);

    const regularBenefits = [
        <div><i className="material-icons">done</i>Propose a new CTI</div>,
        <div><i className="material-icons">done</i>Vote a CTI</div>,
        <div><i className="material-icons">done</i>Get partial CTI content</div>,
        <div><i className="material-icons">done</i>Consume STIX messages</div>,
        <div><i className="material-icons">close</i>Get full CTI content</div>,
    ]
    const plusBenefits = [
        <div><i className="material-icons">done</i>Propose a new CTI</div>,
        <div><i className="material-icons">done</i>Vote a CTI</div>,
        <div><i className="material-icons">done</i>Consume STIX messages</div>,
        <div><i className="material-icons">done</i>Get full CTI content</div>,
        " ",
    ]

    useEffect(() => {
        setLoadingData(true);
        loadUserInfo()
            .then(loadWalletAddress)
            .then(loadSubscriptionPrices)
            .then(() => setLoadingData(false))
            .catch(() => setLoadingData(false))
    }, []);

    const loadSubscriptionPrices = () => {
        return oracleService.getOneCtiPrice()
            .then(oneCtiPrice => {
                setRegularPriceInCti(Math.ceil((oneCtiPrice * SubscriptionPrices.REGULAR) / TokenValues.ONE));
                setPlusPriceInCti(Math.ceil((oneCtiPrice * SubscriptionPrices.PLUS) / TokenValues.ONE));
            })
    }

    const loadUserInfo = () => {
        return ctiUserService.getUserInfo()
            .then(result => {
                // const user = JSON.stringify(result);
                const user = result;
                user.tier = Number(user.tier);
                if (user.tier === Number(SubscriptionTierIndexes.REGULAR.description)) {
                    setTier(SubscriptionTierDescription.REGULAR.description);
                    selectRegularCard();
                } else if (user.tier === Number(SubscriptionTierIndexes.PLUS.description)) {
                    setTier(SubscriptionTierDescription.PLUS.description);
                    selectPlusCard();
                }
            })
            .catch(error => {
                // console.log("error: ", JSON.stringify(error));
                console.log("error: ", error);
                toast.error("Error while fetching current tier", {duration: 1500});
            });
    }

    const loadWalletAddress = () => {
        return walletProvider.get().connect()
            .then(address => {
                setAddress(address);
            })
            .catch(error => {
                console.log("error: ", error);
                setAddress("");
            });
    }

    const activateSubscription = () => {
        setLoadingData(true);
        oracleService.getOneCtiPrice()
            .then(oneCtiPrice => regularSelected ? oneCtiPrice * SubscriptionPrices.REGULAR : oneCtiPrice * SubscriptionPrices.PLUS)
            .then(subscriptionPriceInCti => ctiTokenService.approve(ctiUserService.ctiUserContractAddress, subscriptionPriceInCti))
            .then(() => ctiUserService.registerUser(address, tierIndex))
            .then(() => {
                setTier(regularSelected ? SubscriptionTierDescription.REGULAR.description : SubscriptionTierDescription.PLUS.description);
                toast.success("Subscription completed", {duration: 1500});
            })
            .catch(error => toast.error("Error while activating subscription", {duration: 1500}))
            .finally(() => setLoadingData(false));
    }

    const selectRegularCard = () => {
        setPlusSelected(false);
        setRegularSelected(true);
        setTierIndex(Number(SubscriptionTierIndexes.REGULAR.description));
    }

    const selectPlusCard = () => {
        setRegularSelected(false);
        setPlusSelected(true);
        setTierIndex(Number(SubscriptionTierIndexes.PLUS.description));
    }

    return {
        regularSelected,
        plusSelected,
        loadingData,
        regularBenefits,
        plusBenefits,
        address,
        tier,
        regularPriceInCti,
        plusPriceInCti,
        selectRegularCard,
        selectPlusCard,
        activateSubscription,
        loadWalletAddress,
        setAddress
    }
}

export default usePricingPage;