import {value} from "lodash/seq.js";

export default class AttackPatternMandatoryParameters {

    #name = "";
    #description = "";
    #specVersion = "";
    #created = "";
    #modified = "";

    get description() {
        return this.#description;
    }

    set description(description) {
        this.#description = description;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get specVersion() {
        return this.#specVersion;
    }

    set specVersion(specVersion) {
        this.#specVersion = specVersion;
    }

    get created() {
        return this.#created;
    }

    set created(created) {
        this.#created = created;
    }

    get modified() {
        return this.#modified;
    }

    set modified(modified) {
        this.#modified = modified;
    }

    clone() {
        const clone = new AttackPatternMandatoryParameters();
        clone.setName = this.#name;
        clone.setDescription = this.#description;
        clone.setSpecVersion = this.#specVersion;
        clone.setCreated = this.#created;
        clone.setModified = this.#modified;
        return clone;
    }

    toJson() {
        return {
            "description": this.#description,
            "name": this.#name,
            "specVersion": this.#specVersion,
            "created": this.#created,
            "modified": this.#modified,
        }
    }

}