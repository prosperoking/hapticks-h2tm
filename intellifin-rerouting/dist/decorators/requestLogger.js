"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routeLog;
function routeLog() {
    return function (target, propertyKey, descriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args) {
            let request = args[0];
            const { url, method, body, headers, } = request;
            console.log("[LOG]", {
                url,
                method,
                body,
                headers,
            });
            return original.apply(this, args);
        };
    };
}
//# sourceMappingURL=requestLogger.js.map