import {useState} from "react";

const useButtonHook = ({onClick}) => {
    const defaultClassName = "my-button";
    const [className, setClassName] = useState("my-button");

    const handleClick = (_, timeout = 3000) => {
        if (className === defaultClassName) {
            setClassName(defaultClassName + " active");
            onClick()
                .then(() => setClassName(defaultClassName))
                .catch(error => {
                    setClassName(defaultClassName);
                });
            setTimeout(() => setClassName(defaultClassName), timeout);
        }
    }

    return {handleClick, className}
}

export default useButtonHook;