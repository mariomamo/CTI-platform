import "./LoadingOverlay.css";

const LoadingOverlay = ({size = 60}) => {
    return (
        <div id="overlay">
            <div className="w-100 d-flex justify-content-center align-items-center">
                <div className="spinner" style={{width: `${size}px`, height: `${size}px`}}></div>
            </div>
        </div>
    )
}

export default LoadingOverlay;