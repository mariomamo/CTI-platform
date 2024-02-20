import AttackPatternMandatoryParameters from "./AttackPatternMandatoryParameters.jsx";
import AttackPatternOptionalParameters from "./AttackPatternOptionalParameters.jsx";

export default class AttackPattern {
    #id = "";
    #type = "";
    // Required
    #mandatoryParameters;
    // Optionals
    #optionalParameters;


    constructor() {
        this.#mandatoryParameters = new AttackPatternMandatoryParameters();
        this.#optionalParameters = new AttackPatternOptionalParameters();
    }


    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id;
    }

    get type() {
        return this.#type;
    }

    set type(type) {
        this.#type = type;
    }

    get mandatoryParameters() {
        return this.#mandatoryParameters;
    }

    set mandatoryParameters(mandatoryParameters) {
        this.#mandatoryParameters = mandatoryParameters;
    }

    get optionalParameters() {
        return this.#optionalParameters;
    }

    set optionalParameters(optionalParameters) {
        this.#optionalParameters = optionalParameters;
    }

    clone() {
        const clone = new AttackPattern();
        clone.id = this.#id;
        clone.type = this.#type;
        clone.mandatoryParameters = this.#mandatoryParameters;
        clone.optionalParameters = this.#optionalParameters;
        return clone;
    }

    toJson() {
        return {
            "id": this.#id,
            "type": this.#type,
            "mandatoryParameters": this.#mandatoryParameters.toJson(),
            "optionalParameters": this.#optionalParameters.toJson()
        }
    }
}
