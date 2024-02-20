import {useEffect, useState} from "react";
import useAttackPatternHook from "../../../../hooks/AttackPatternHook.jsx";

const useStepForm = ({numberOfSteps, steps, onFinish}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const defaultBtnNextClassName = "btn btn-primary attack-pattern-btn-next";
    const [btnNextClassName, setBtnNextClassName] = useState(`${defaultBtnNextClassName} attack-pattern-btn-off`);
    const defaultBtnSubmitClassName = "btn btn-primary attack-pattern-btn-submit";
    const [btnSubmitClassName, setBtnSubmitClassName] = useState(`${defaultBtnSubmitClassName} attack-pattern-btn-off`);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const attackPatternHook = useAttackPatternHook();

    useEffect(() => {
        let areAllFilled = false;
        if (!steps[currentStep].enableNextButton || steps[currentStep].enableNextButton()) areAllFilled = true;
        if (currentStep === numberOfSteps - 1) switchSubmitButtonStatus(areAllFilled);
        else switchNextButtonStatus(areAllFilled);
    }, [attackPatternHook.attackPattern, currentStep]);

    const switchNextButtonStatus = (enabled) => {
        if (enabled) setBtnNextClassName(defaultBtnNextClassName);
        else setBtnNextClassName(`${defaultBtnNextClassName} attack-pattern-btn-off`);
    }

    const switchSubmitButtonStatus = (enabled) => {
        if (enabled) setBtnSubmitClassName(defaultBtnSubmitClassName);
        else setBtnSubmitClassName(`${defaultBtnSubmitClassName} attack-pattern-btn-off`);
    }

    const goNext = () => {
        if (currentStep < numberOfSteps && btnNextClassName === defaultBtnNextClassName) setCurrentStep(currentStep + 1);
    }

    const goBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    }

    const onSubmit = () => {
        if (!isSubmitLoading) {
            setIsSubmitLoading(true);
            onFinish()
                .catch(() => setIsSubmitLoading(false));
        }
    }

    return {currentStep, btnSubmitClassName, btnNextClassName, goNext, goBack, isSubmitLoading, onSubmit}
}

export default useStepForm;