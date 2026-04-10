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
                errors: result.array().reduce((acc, err) => { var _a, _b; return (Object.assign(Object.assign({}, acc), { [(_a = err.param) !== null && _a !== void 0 ? _a : err.path]: [...(acc[(_b = err.param) !== null && _b !== void 0 ? _b : err.path] || []), err.msg] })); }, {}),
                message: "Invalid Data"
            });
        }
        next();
    };
    return [validator, handleRequest];
}
//# sourceMappingURL=index.js.map