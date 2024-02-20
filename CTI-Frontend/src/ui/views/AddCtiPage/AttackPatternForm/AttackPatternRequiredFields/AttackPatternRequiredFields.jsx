import useAttackPatternRequiredFields from "./AttackPatternRequiredFieldsHook.jsx";

const AttackPatternRequiredFields = () => {
    const {
        type, setType,
        name, setName,
        description, setDescription,
        specVersion, setSpecVersion,
    } = useAttackPatternRequiredFields();

    return (
        <div>
            Mandatory informations
            <div className="form-group">
                <label>Type</label>
                <input disabled type="text" className="form-control" placeholder="Type of the CTI" value={type}
                       onChange={(e) => setType(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" placeholder="Name" value={name}
                       onChange={(e) => setName(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Description</label>
                <input type="text" className="form-control" placeholder="Description" value={description}
                       onChange={(e) => setDescription(e.currentTarget.value)}/>
            </div>
            <div className="form-group">
                <label>Spec version</label>
                <input type="text" className="form-control" placeholder="Spec version" value={specVersion}
                       onChange={(e) => setSpecVersion(e.currentTarget.value)}/>
            </div>
        </div>
    )
}

export default AttackPatternRequiredFields;