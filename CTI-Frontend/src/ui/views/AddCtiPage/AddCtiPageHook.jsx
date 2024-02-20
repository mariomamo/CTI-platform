import AttackPatternRequiredFields from "./AttackPatternForm/AttackPatternRequiredFields/AttackPatternRequiredFields.jsx";
import AttackPatternOptionalFields from "./AttackPatternForm/AttackPatternOptionalFields/AttackPatternOptionalFields.jsx";
import useAttackPatternHook from "../../../hooks/AttackPatternHook.jsx";
import useCtiFactoryService from "../../../services/Web3/CtiFactoryService.jsx";
import StorageKeys from "../../../enums/StorageKeys.jsx";
import {useStorage} from "../../../contexts/storage/WebStorageProvider.jsx";
import {toast} from "react-hot-toast";

const useAddCtiPage = ({onFinish}) => {

    const attackPatternHook = useAttackPatternHook();
    const attackPatternCti = attackPatternHook.attackPattern;
    const daoService = useCtiFactoryService();
    const storageService = useStorage();

    const steps = [
        {
            component: <AttackPatternRequiredFields/>,
            enableNextButton: () => checkRequiredFields()
        },
        {
            component: <AttackPatternOptionalFields/>
        }
    ]

    const checkRequiredFields = () => {
        return attackPatternCti.type !== undefined && attackPatternCti.type !== "" &&
            attackPatternCti.mandatoryParameters.name !== undefined && attackPatternCti.mandatoryParameters.name !== "" &&
            attackPatternCti.mandatoryParameters.specVersion !== undefined && attackPatternCti.mandatoryParameters.specVersion !== "" &&
            attackPatternCti.mandatoryParameters.description !== undefined && attackPatternCti.mandatoryParameters.description !== ""
    }

    const submitNewCti = async () => {
        const accessToken = await storageService.get(StorageKeys.ACCESS_TOKEN.description);
        //TODO: L'address dovrebbe essere preso dal token jwt?
        return new Promise((resolve, reject) => {
            return daoService.deployCti(attackPatternCti, accessToken)
                .then(res => {
                    toast.success("CTI added!");
                    onFinish();
                    resolve();
                })
                .catch(error => {
                    toast.error("Error while inserting the CTI");
                    reject(error);
                })
        })
    }

    return {steps, submitNewCti}
}

export default useAddCtiPage;