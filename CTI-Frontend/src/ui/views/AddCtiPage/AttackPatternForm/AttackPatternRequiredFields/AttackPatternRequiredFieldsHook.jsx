import useAttackPatternHook from "../../../../../hooks/AttackPatternHook.jsx";
import {useEffect} from "react";

const useAttackPatternRequiredFields = () => {
    const attackPattern = useAttackPatternHook();
    const attackPatternCti = attackPattern.attackPattern;

    useEffect(() => {
        setType("attack-pattern")
    }, []);

    const setType = (newType) => {
        attackPattern.updateType(newType);
    }

    const setName = (newName) => {
        attackPattern.updateName(newName);
    }

    const setDescription = (newDescription) => {
        attackPattern.updateDescription(newDescription);
    }

    const setSpecVersion = (newSpecVersion) => {
        attackPattern.updateSpecVersion(newSpecVersion);
    }

    return {
        type: attackPatternCti.type, setType,
        name: attackPatternCti.mandatoryParameters.name, setName,
        description: attackPatternCti.mandatoryParameters.description, setDescription,
        specVersion: attackPatternCti.mandatoryParameters.specVersion, setSpecVersion,
    }
}

export default useAttackPatternRequiredFields;