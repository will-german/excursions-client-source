"use strict";

export default class Validator {

    #isObjectAndValid(args) {
        if (typeof args === "object" && args !== null && !Array.isArray(args)) {
            if (Object.keys(args).length > 0) {
                for (const [key, value] of Object.entries(args)) {
                    if (value) {
                        return true;
                    }
                }
            }
        }

        return false;

    }

    isEmpty(args) {

    }

};