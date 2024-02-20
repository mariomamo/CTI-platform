import {value} from "lodash/seq.js";
import {title} from "process";

export default class CtiProposal {
    #id;
    #description;
    #title;
    #address;
    #hash;
    #startingVote;
    #endingVote;
    #status;
    #valid;
    #invalid;
    #abstained;
    #optionalParameters;

    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id;
    }

    get description() {
        return this.#description;
    }

    set description(description) {
        this.#description = description;
    }

    get title() {
        return this.#title;
    }

    set title(title) {
        this.#title = title;
    }

    get optionalParameters() {
        return this.#optionalParameters;
    }

    set optionalParameters(optionalParameters) {
        this.#optionalParameters = optionalParameters;
    }

    set address(address) {
        this.#address = address;
    }

    get address() {
        return this.#address;
    }

    get hash() {
        return this.#hash;
    }

    set hash(hash) {
        this.#hash = hash;
    }

    get startingVote() {
        return this.#startingVote;
    }

    set startingVote(startingVote) {
        this.#startingVote = startingVote;
    }

    get endingVote() {
        return this.#endingVote;
    }

    set endingVote(endingVote) {
        this.#endingVote = endingVote;
    }

    get status() {
        return this.#status;
    }

    set status(status) {
        this.#status = status;
    }

    get valid() {
        return this.#valid;
    }

    set valid(valid) {
        this.#valid = valid;
    }

    get invalid() {
        return this.#invalid;
    }

    set invalid(invalid) {
        this.#invalid = invalid;
    }

    get abstained() {
        return this.#abstained;
    }

    set abstained(abstained) {
        this.#abstained = abstained;
    }

}