import React from "react";
import "./StepForm.css";
import useStepForm from "./StepFormHook.jsx";
import LoadingOverlay from "../../../LoadingOverlay/LoadingOverlay.jsx";

const StepForm = ({steps, onFinish}) => {
    const numberOfSteps = steps.length;
    const {currentStep, btnSubmitClassName, btnNextClassName, goNext, goBack, isSubmitLoading, onSubmit} = useStepForm({numberOfSteps, steps, onFinish});

    return (
        <div>
            <div className="attack-pattern-stepper-container">
                <ul className="attack-pattern-dots-list">
                    {
                        [...Array(numberOfSteps)].map((_, index) => {
                            let className = "attack-pattern-dot";
                            if (index === currentStep) className += " active";
                            return <li className={className} key={index}></li>
                        })
                    }
                </ul>
                {currentStep !== 0 && <button className="btn btn-light" onClick={goBack}>Back</button>}
                {currentStep < numberOfSteps - 1 && <button className={btnNextClassName} onClick={goNext}>Next</button>}
                {currentStep === numberOfSteps - 1 &&
                    <div className="step-form-submit-container">
                        {isSubmitLoading && <LoadingOverlay size={20}/>}
                        <button className={btnSubmitClassName} onClick={onSubmit}>Submit</button>
                    </div>
                }
            </div>
            {steps[currentStep].component}
        </div>
    )
}

export default StepForm;