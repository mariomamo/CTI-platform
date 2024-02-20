import {value} from "lodash/seq.js";

export default class AttackPatternOptionalParameters {

    #createdByRef = "";
    #revoked = "";
    #labels = "";
    #confidence = "";
    #lang = "";
    #externalReferences = "";
    #objectMarkingRefs = "";
    #granularMarkings = "";
    #extensions = "";

    get createdByRef() {
        return this.#createdByRef;
    }

    set createdByRef(createdByRef) {
        this.#createdByRef = createdByRef;
    }

    get revoked() {
        return this.#revoked;
    }

    set revoked(revoked) {
        this.#revoked = revoked;
    }

    get labels() {
        return this.#labels;
    }

    set labels(labels) {
        this.#labels = labels;
    }

    get confidence() {
        return this.#confidence;
    }

    set confidence(confidence) {
        this.#confidence = confidence;
    }

    get lang() {
        return this.#lang;
    }

    set lang(lang) {
        this.#lang = lang;
    }

    get externalReferences() {
        return this.#externalReferences;
    }

    set externalReferences(externalReferences) {
        this.#externalReferences = externalReferences;
    }

    get objectMarkingRefs() {
        return this.#objectMarkingRefs;
    }

    set objectMarkingRefs(objectMarkingRefs) {
        this.#objectMarkingRefs = objectMarkingRefs;
    }

    get granularMarkings() {
        return this.#granularMarkings;
    }

    set granularMarkings(granularMarkings) {
        this.#granularMarkings = granularMarkings;
    }

    get extensions() {
        return this.#extensions;
    }

    set extensions(extensions) {
        this.#extensions = extensions;
    }

    clone() {
        const clone = new AttackPatternOptionalParameters();
        clone.setCreatedByRef = this.#createdByRef;
        clone.setRevoked = this.#revoked;
        clone.setLabels = this.#labels;
        clone.setConfidence = this.#confidence;
        clone.setLang = this.#lang;
        clone.setExternalReferences = this.#externalReferences;
        clone.setObjectMarkingRefs = this.#objectMarkingRefs;
        clone.setGranularMarkings = this.#granularMarkings;
        clone.setExtensions = this.#extensions;
        return clone;
    }

    toJson() {
        return {
            "createdByRef": this.#createdByRef,
            "revoked": this.#revoked,
            "labels": this.#labels,
            "confidence": this.#confidence,
            "lang": this.#lang,
            "exernalReferences": this.#externalReferences,
            "objectMarkingRefs": this.#objectMarkingRefs,
            "granularMarkings": this.#granularMarkings,
            "extensions": this.#extensions
        }
    }

}