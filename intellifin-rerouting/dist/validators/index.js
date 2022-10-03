"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidatedRequest = void 0;
const express_validator_1 = require("express-validator");
function createValidatedRequest(validator) {
    const handleRequest = (req, res, next) => {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            return res.status(412).json({
                errors: result.array().reduce((acc, err) => (Object.assign(Object.assign({}, acc), { [err.param]: [...(acc[err.param] || []), err.msg] })), {}),
                message: "Invalid Data"
            });
        }
        next();
    };
    return [validator, handleRequest];
}
exports.createValidatedRequest = createValidatedRequest;
//# sourceMappingURL=index.js.map