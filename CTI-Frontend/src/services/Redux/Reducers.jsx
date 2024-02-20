import WalletInfoReduxOperations from "./WalletInfoReduxOperations.jsx";
import WalletInfoReducerKeys from "./WalletInfoReducerKeys.jsx";
import AddCtiReduxOperations from "./AddCtiReduxOperations.jsx";
import AttackPattern from "../../objects/cti/AttackPattern.jsx";

const wallet_initial_state = {
    [WalletInfoReducerKeys.WALLET_ADDRESS.description]: "",
}

const walletInfoReducer = (state = wallet_initial_state, action) => {
    switch (action.type) {
        case WalletInfoReduxOperations.SET_WALLET_ADDRESS.description:
            return state = {
                ...state,
                [WalletInfoReducerKeys.WALLET_ADDRESS.description]: action.payload[WalletInfoReducerKeys.WALLET_ADDRESS.description]
            };
        case WalletInfoReduxOperations.DELETE_WALLET_INFO.description:
            return state = {};
        default:
            return state;
    }
}

const addAttackPatternReducer = (state = new AttackPattern(), action) => {
    switch (action.type) {
        case AddCtiReduxOperations.UPDATE.description:
            const newState = state.clone();
            if (action.payload.id !== undefined) newState.id = action.payload.id;
            if (action.payload.type !== undefined) newState.type = action.payload.type;
            if (action.payload.name !== undefined) newState.mandatoryParameters.name = action.payload.name;
            if (action.payload.specVersion !== undefined) newState.mandatoryParameters.specVersion = action.payload.specVersion;
            if (action.payload.created !== undefined) newState.mandatoryParameters.created = action.payload.created;
            if (action.payload.modified !== undefined) newState.mandatoryParameters.modified = action.payload.modified;
            if (action.payload.description !== undefined) newState.mandatoryParameters.description = action.payload.description;
            if (action.payload.createdByRef !== undefined) newState.optionalParameters.createdByRef = action.payload.createdByRef;
            if (action.payload.revoked !== undefined) newState.optionalParameters.revoked = action.payload.revoked;
            if (action.payload.labels !== undefined) newState.optionalParameters.labels = action.payload.labels;
            if (action.payload.confidence !== undefined) newState.optionalParameters.confidence = action.payload.confidence;
            if (action.payload.lang !== undefined) newState.optionalParameters.lang = action.payload.lang;
            if (action.payload.externalReferences !== undefined) newState.optionalParameters.externalReferences = action.payload.externalReferences;
            if (action.payload.objectMarkingRefs !== undefined) newState.optionalParameters.objectMarkingRefs = action.payload.objectMarkingRefs;
            if (action.payload.granularMarkings !== undefined) newState.optionalParameters.granularMarkings = action.payload.granularMarkings;
            if (action.payload.extensions !== undefined) newState.optionalParameters.extensions = action.payload.extensions;
            return newState;
        case AddCtiReduxOperations.DELETE.description:
            return new AttackPattern();
        default:
            return state;
    }
}

export {walletInfoReducer, addAttackPatternReducer};