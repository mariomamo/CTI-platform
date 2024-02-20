import "./Airdrop.css";
import {Button} from "react-bootstrap";
import useAirdropHook from "./AirdropHook.jsx";
import LoadingOverlay from "../../LoadingOverlay/LoadingOverlay.jsx";

const Airdrop = () => {
    const {claimTokens, isLoading} = useAirdropHook();

    return (
        <div className="airdrop-container">
            <h1>Get your CTI coins now!</h1>
            <h3>Get your CTI tokens today and start a subscription!</h3>
            <h4>Access to our knowledge base and secure your app</h4>
            <div className="airdrop-button-container">
                {isLoading && <LoadingOverlay size={30}/>}
                <Button style={{fontSize: 30}} onClick={claimTokens}>Claim</Button>
            </div>
        </div>
    )
}

export default Airdrop;