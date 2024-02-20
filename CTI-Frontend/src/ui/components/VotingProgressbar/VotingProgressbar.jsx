import React, {useEffect} from "react";

const VotingProgressbar = ({yes=0, no=0, style})=> {
    useEffect(() => {
        if (yes > 100) yes = 100;
        if (no > 100) no = 100;
        if (yes < 0) yes = 0;
        if (no < 0) no = 0;
        if (yes + no > 100) {
            yes = 50;
            no = 50;
        }
    }, []);

    return (
        <div style={{
            ...style,
            background: `linear-gradient(to right, #00cf30 ${yes}%, #d80228 ${yes}%, #d80228 ${yes + no}%, #cccccc 0)`
        }} className="vote-progressbar"></div>
    )
}

export default VotingProgressbar;