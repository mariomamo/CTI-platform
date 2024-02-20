import useAttackPatternHook from "../../../../../hooks/AttackPatternHook.jsx";

const useAttackPatternOptionalFields = () => {
    const attackPattern = useAttackPatternHook();
    const attackPatternCti = attackPattern.attackPattern;

    const setCreatedByRef = (newCreatedByRef) => {
        attackPattern.updateCreatedByRef(newCreatedByRef);
    }

    const setRevoked = (newRevoked) => {
        attackPattern.updateRevoked(newRevoked);
    }

    const setLabels = (newLabels) => {
        attackPattern.updateLabels(newLabels);
    }

    const setConfidence = (newConfidence) => {
        attackPattern.updateConfidence(newConfidence);
    }

    const setLang = (newLang) => {
        attackPattern.updateLang(newLang);
    }

    const setExternalReferences = (newExternalReferences) => {
        attackPattern.updateExternalReferences(newExternalReferences);
    }

    const setObjectMakingRefs = (newObjectMarkingRefs) => {
        attackPattern.updateObjectMarkingRefs(newObjectMarkingRefs);
    }

    const setGranularMarking = (newGranularMarking) => {
        attackPattern.updateGranularMarkings(newGranularMarking);
    }

    const setExtensions = (newExtensions) => {
        attackPattern.updateExtensions(newExtensions);
    }

    return {
        createdByRef: attackPatternCti.optionalParameters.createdByRef, setCreatedByRef,
        revoked: attackPatternCti.optionalParameters.revoked, setRevoked,
        labels: attackPatternCti.optionalParameters.labels, setLabels,
        confidence: attackPatternCti.optionalParameters.confidence, setConfidence,
        lang: attackPatternCti.optionalParameters.lang, setLang,
        externalReferences: attackPatternCti.optionalParameters.externalReferences, setExternalReferences,
        objectMakingRefs: attackPatternCti.optionalParameters.objectMarkingRefs, setObjectMakingRefs,
        granularMarkings: attackPatternCti.optionalParameters.granularMarkings, setGranularMarking,
        extensions: attackPatternCti.optionalParameters.extensions, setExtensions
    }
}

export default useAttackPatternOptionalFields;