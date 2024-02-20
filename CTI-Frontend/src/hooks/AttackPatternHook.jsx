import {useDispatch, useSelector} from "react-redux";
import ReduxReducersNames from "../services/Redux/ReduxReducersNames.jsx";
import AddCtiReduxOperations from "../services/Redux/AddCtiReduxOperations.jsx";

const useAttackPatternHook = () => {
    const attackPattern = useSelector(state => state[ReduxReducersNames.ATTACK_PATTERN_CTI.description]);
    const dispatch = useDispatch();

    const updateId = (newId) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                id: newId
            }
        });
    }

    const updateType = (newType) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                type: newType
            }
        });
    }

    const updateName = (newName) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                name: newName
            }
        });
    }

    const updateSpecVersion = (newSpecVersion) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                specVersion: newSpecVersion
            }
        });
    }

    const updateCreated = (newCreated) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                created: newCreated
            }
        });
    }

    const updateModified = (newModified) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                modified: newModified
            }
        });
    }

    const updateDescription = (newDescription) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                description: newDescription
            }
        });
    }

    const updateCreatedByRef = (newCreatedByRef) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                createdByRef: newCreatedByRef
            }
        });
    }

    const updateRevoked = (newRevoked) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                revoked: newRevoked
            }
        });
    }

    const updateLabels = (newLabels) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                labels: newLabels
            }
        });
    }

    const updateConfidence = (newConfidence) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                confidence: newConfidence
            }
        });
    }

    const updateLang = (newLang) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                lang: newLang
            }
        });
    }

    const updateExternalReferences = (newExternalReferences) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                externalReferences: newExternalReferences
            }
        });
    }

    const updateObjectMarkingRefs = (newObjectMarkingRefs) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                objectMarkingRefs: newObjectMarkingRefs
            }
        });
    }

    const updateGranularMarkings = (newGranularMarkings) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                granularMarkings: newGranularMarkings
            }
        });
    }

    const updateExtensions = (newExtensions) => {
        return dispatch({
            type: AddCtiReduxOperations.UPDATE.description,
            payload: {
                extensions: newExtensions
            }
        });
    }

    const deleteState = () => {
        return dispatch({type: AddCtiReduxOperations.DELETE.description});
    }

    return {
        attackPattern,
        updateId,
        updateType,
        updateName,
        updateSpecVersion,
        updateCreated,
        updateModified,
        updateDescription,
        updateCreatedByRef,
        updateRevoked,
        updateLabels,
        updateConfidence,
        updateLang,
        updateExternalReferences,
        updateObjectMarkingRefs,
        updateGranularMarkings,
        updateExtensions,
        deleteState
    }
}

export default useAttackPatternHook;