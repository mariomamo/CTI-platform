import {useEffect, useState} from "react";
import useCtiUserService from "../../../services/Web3/CtiUserServiceHook.jsx";
import {SubscriptionTierDescription} from "../../../enums/SubscriptionTierDescription.jsx";
import {SubscriptionTierIndexes} from "../../../enums/SubscriptionTierIndexes.jsx";

const useUserProfileHook = () => {
    const [daysFromSubscription, setDaysFromSubscription] = useState(0);
    const [daysFromSubscriptionInPercentage, setDaysFromSubscriptionInPercentage] = useState(0);
    const [validCti, setValidCti] = useState(0);
    const [invalidCti, setInvalidCti] = useState(0);
    const [publishedCti, setPublishedCti] = useState(0);
    const [rating, setRating] = useState(0);
    const [tier, setTier] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const ctiUserService = useCtiUserService();

    useEffect(() => {
        ctiUserService.getUserInfo()
            .then(userInfo => {
                calculateDaysFromSubscription(userInfo.endSubscription);
                setValidCti(Number(userInfo.validCti));
                setInvalidCti(Number(userInfo.invalidCti));
                setPublishedCti(Number(userInfo.publishedCti));
                calculateRating();
                detectTier(Number(userInfo.tier));
                setIsLoading(false);
            })
            .catch(error => {
                detectTier(2);
                setIsLoading(false);
            })
    }, []);

    const calculateDaysFromSubscription = (endSubscription) => {
        const today = new Date();
        const end = new Date(Number(endSubscription) * 1000);

        const diffTime = Math.abs(end - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysFromSubscription(diffDays);
        setDaysFromSubscriptionInPercentage(Math.round(diffDays * 100 / 365));
    }

    const calculateRating = () => {
        if (validCti > 0) setRating(publishedCti / validCti);
        else setRating(0);
    }

    const detectTier = (tier) => {
        if (tier === Number(SubscriptionTierIndexes.REGULAR.description)) setTier(SubscriptionTierDescription.REGULAR.description);
        else if (tier === Number(SubscriptionTierIndexes.PLUS.description)) setTier(SubscriptionTierDescription.PLUS.description);
        else setTier(SubscriptionTierDescription.FREE.description);
    }

    const smallStats = [
        {
            label: "CTI approved",
            value: validCti,
            // percentage: "4.7%",
            // increase: true,
            // chartLabels: [null, null, null, null, null, null, null],
            // attrs: {md: "6", sm: "6"},
            // datasets: [
            //     {
            //         label: "Today",
            //         fill: "start",
            //         borderWidth: 1.5,
            //         backgroundColor: "rgba(0, 184, 216, 0.1)",
            //         borderColor: "rgb(0, 184, 216)",
            //         data: [1, 2, 1, 3, 5, 4, 7]
            //     }
            // ]
        },
        {
            label: "CTI rejected",
            value: invalidCti,
            // percentage: "12.4",
            // increase: true,
            // chartLabels: [null, null, null, null, null, null, null],
            // attrs: {md: "6", sm: "6"},
            // datasets: [
            //     {
            //         label: "Today",
            //         fill: "start",
            //         borderWidth: 1.5,
            //         backgroundColor: "rgba(23,198,113,0.1)",
            //         borderColor: "rgb(23,198,113)",
            //         data: [1, 2, 3, 3, 3, 4, 4]
            //     }
            // ]
        },
        {
            label: "CTI published",
            value: publishedCti,
            // percentage: "3.8%",
            // increase: false,
            // decrease: true,
            // chartLabels: [null, null, null, null, null, null, null],
            // attrs: {md: "4", sm: "6"},
            // datasets: [
            //     {
            //         label: "Today",
            //         fill: "start",
            //         borderWidth: 1.5,
            //         backgroundColor: "rgba(255,180,0,0.1)",
            //         borderColor: "rgb(255,180,0)",
            //         data: [2, 3, 3, 3, 4, 3, 3]
            //     }
            // ]
        },
        {
            label: "Rating",
            value: `${rating}/5`,
            // percentage: "2.71%",
            // increase: false,
            // decrease: true,
            // chartLabels: [null, null, null, null, null, null, null],
            // attrs: {md: "4", sm: "6"},
            // datasets: [
            //     {
            //         label: "Today",
            //         fill: "start",
            //         borderWidth: 1.5,
            //         backgroundColor: "rgba(255,65,105,0.1)",
            //         borderColor: "rgb(255,65,105)",
            //         data: [1, 7, 1, 3, 1, 4, 8]
            //     }
            // ]
        },
        {
            label: "Tier",
            value: tier.toUpperCase(),
            // percentage: "2.4%",
            // increase: false,
            // decrease: true,
            // chartLabels: [null, null, null, null, null, null, null],
            // attrs: {md: "4", sm: "6"},
            // datasets: [
            //     {
            //         label: "Today",
            //         fill: "start",
            //         borderWidth: 1.5,
            //         backgroundColor: "rgb(0,123,255,0.1)",
            //         borderColor: "rgb(0,123,255)",
            //         data: [3, 2, 3, 2, 4, 5, 4]
            //     }
            // ]
        }
    ]

    return {smallStats, daysFromSubscription, daysFromSubscriptionInPercentage, isLoading}
}

export default useUserProfileHook;