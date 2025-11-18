"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidatedRequest = createValidatedRequest;
const express_validator_1 = require("express-validator");
function createValidatedRequest(validator) {
    const handleRequest = (req, res, next) => {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            return res.status(412).json({
                // @ts-ignore
                errors: result.array().reduce((acc, err) => (Object.assign(Object.assign({}, acc), { [err.param]: [...(acc[err.param] || []), err.msg] })), {}),
                message: "Invalid Data"
            });
        }
        next();
    };
    return [validator, handleRequest];
}
//# sourceMappingURL=index.js.map