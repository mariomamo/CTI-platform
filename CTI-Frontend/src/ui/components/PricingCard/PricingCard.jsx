import "./PricingCard.css";
import {Card, CardTitle} from "react-bootstrap";
import LoadingOverlay from "../../LoadingOverlay/LoadingOverlay.jsx";
import {useEffect, useState} from "react";
import {SubscriptionTierDescription} from "../../../enums/SubscriptionTierDescription.jsx";

const PricingCard = ({free, regular, plus, priceInDollar, priceInCti, benefits, selected, onClick, isLoading = false}) => {
    const displayedTier = regular ? SubscriptionTierDescription.REGULAR.description : plus ? SubscriptionTierDescription.PLUS.description : free ? SubscriptionTierDescription.FREE.description : "";
    const [tier, setTier] = useState("");
    const [icon, setIcon] = useState("");
    const [className, setClassName] = useState("pricing-page-card");
    const [disabled, setDisabled] = useState("off");
    const [selectedClassName, setSelectedClassName] = useState("");

    useEffect(() => {
        setClassName(`pricing-page-card ${tier} ${selectedClassName} ${disabled}`);
    }, [tier, selectedClassName, disabled]);

    useEffect(() => {
        if (!isLoading) {
            if (free) setTier(SubscriptionTierDescription.FREE.description);
            else if (regular) setTier(SubscriptionTierDescription.REGULAR.description);
            else if (plus) setTier(SubscriptionTierDescription.PLUS.description);
            else setTier(" ");
        } else setTier(" ");

        if (regular) setIcon("flight");
        else if (plus) setIcon("rocket_launch");
        else setIcon("pedal_bike");

        if (isLoading) setDisabled("off");
        else setDisabled("");

        if (selected) setSelectedClassName("selected");
        else setSelectedClassName("");

    }, [isLoading, selected]);

    useEffect(() => {
        setClassName(`pricing-page-card ${tier} ${selectedClassName} ${disabled}`);
    }, [tier, selected, disabled]);

    useEffect(() => {
    }, [className]);

    const internalOnClick = () => {
        if (!isLoading) {
            return onClick();
        }
    }

    return (
        <Card className={className} text={"center"} onClick={internalOnClick}>
            {isLoading && <LoadingOverlay/>}
            <CardTitle className="pricing-page title">
                <span className="material-icons">
                    {icon}
                </span>
                <h2>{displayedTier.charAt(0).toUpperCase() + displayedTier.slice(1)}</h2>
            </CardTitle>
            <div className="pricing-page price">
                <h4><sup>USD</sup>{priceInDollar}</h4>
                <h4><sup>CTI</sup>{priceInCti}</h4>
            </div>
            <div className="pricing-page option">
                <ul>
                    {
                        benefits.map((benefit, key) => <li key={key}>{benefit}</li>)
                    }
                </ul>
            </div>
            {/*<div className="pricing-page-activate-button">Activate</div>*/}
        </Card>
    )
}

export default PricingCard;