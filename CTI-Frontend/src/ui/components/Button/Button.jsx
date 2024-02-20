import './Button.css';
import useButtonHook from "./ButtonHook.jsx";

const Button = ({text, onClick})=> {
    const {handleClick, className} = useButtonHook({onClick});

    return (
        <div className={className} onClick={handleClick}>
            {text}
        </div>
    )
}

export default Button;