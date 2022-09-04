"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidatedRequest = void 0;
const express_validator_1 = require("express-validator");
function createValidatedRequest(validator) {
    const handleRequest = (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(412).json({
                errors,
                message: "Invalid Data"
            });
        }
        next();
    };
    return [validator, handleRequest];
}
exports.createValidatedRequest = createValidatedRequest;
//# sourceMappingURL=index.js.map