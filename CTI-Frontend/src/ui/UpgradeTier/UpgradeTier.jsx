import "./UpgradeTier.css";
import {useNavigate} from "react-router-dom";
import RoutesPaths from "../../enums/RoutesPaths.jsx";

const UpgradeTier = () => {
    const navigate = useNavigate();

    return (
        <div className="upgrade-tier-container">
            <div>
                <h3>This content is available only with a Plus subscription</h3>
                <h4 className="upgrade-tier-container-go-to-pricing" onClick={() => navigate(RoutesPaths.PRICING.description)}>Go to pricing page</h4>
            </div>
        </div>
    )
}

export default UpgradeTier;