"use strict";

export default class QueryBuilder {

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

    build(args) {
        if (!this.#isObjectAndValid(args)) {
            return { Error: "Args must be an object with at least one non-null property." };
        }

        let query = `?`;

        for (const [key, value] of Object.entries(args)) {
            if (!value) {
                continue;
            }

            if (query.length > 1) {
                query += `&`;
            }

            query += `${key}=${value}`;
        }

        return query;

    }
}