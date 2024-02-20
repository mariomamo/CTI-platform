import useAttackPatternOptionalFields from "./AttackPatternOptionalFieldsHook.jsx";

const AttackPatternOptionalFields = () => {
    const {
        createdByRef, setCreatedByRef,
        revoked, setRevoked,
        labels, setLabels,
        confidence, setConfidence,
        lang, setLang,
        externalReferences, setExternalReferences,
        objectMakingRefs, setObjectMakingRefs,
        granularMarkings, setGranularMarking,
        extensions, setExtensions
    } = useAttackPatternOptionalFields();

    return (
        <div>
            Not mandatory informations
            <div className="form-group">
                <label>Created by ref</label>
                <input type="text" className="form-control" placeholder="Created by ref" value={createdByRef} onChange={(e) => setCreatedByRef(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Revoked</label>
                <input type="text" className="form-control" placeholder="Revoked date" value={revoked} onChange={(e) => setRevoked(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Labels</label>
                <input type="text" className="form-control" placeholder="Labels" value={labels} onChange={(e) => setLabels(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Confidence</label>
                <input type="text" className="form-control" placeholder="Confidence" value={confidence} onChange={(e) => setConfidence(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Lang</label>
                <input type="text" className="form-control" placeholder="Lang" value={lang} onChange={(e) => setLang(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>External references</label>
                <input type="text" className="form-control" placeholder="External references" value={externalReferences} onChange={(e) => setExternalReferences(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Object marking refs</label>
                <input type="text" className="form-control" placeholder="Object marking refs" value={objectMakingRefs} onChange={(e) => setObjectMakingRefs(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Granular markings</label>
                <input type="text" className="form-control" placeholder="Granular markings" value={granularMarkings} onChange={(e) => setGranularMarking(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Extensions</label>
                <input type="text" className="form-control" placeholder="Extensions" value={extensions} onChange={(e) => setExtensions(e.currentTarget.value)}/>
            </div>
        </div>
    )
}

export default AttackPatternOptionalFields;