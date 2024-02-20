import "./AddCtiPage.css";
import StepForm from "./AttackPatternForm/StepForm.jsx";
import useAddCtiPage from "./AddCtiPageHook.jsx";

const AddCtiPage = ({onFinish}) => {
    const {steps, submitNewCti} = useAddCtiPage({onFinish});

    return (
        <div className="add-cti-container">
            <StepForm steps={steps} onFinish={submitNewCti}/>
        </div>
    )
}

export default AddCtiPage;