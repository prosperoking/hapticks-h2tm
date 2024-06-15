"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_PERMISSIONS = void 0;
exports.APP_PERMISSIONS = {
    "transactions": ['list', 'view', "print", "export", "stats"],
    "users": ['list', 'view', 'create', 'update', 'delete'],
    "organisations": ['list', 'view', 'create', 'update', 'view-secret', 'rotate-secret', 'delete', 'create-api-key'],
    "profiles": ['list', 'view', 'create', 'update', 'delete', 'rotate-keys'],
    "terminals": ['list', 'view', 'create', 'update', "bulk_upload", 'delete', 'export', 'trigger-keyexchange'],
    "generated-tids": ['list', 'view', 'generate',],
    "groupTid": ['list', 'view', 'create', 'update', 'delete', 'trigger-keyexchange'],
    "webhook_listeners": ['list', 'view', 'create', 'update', 'delete'],
    "webhooks": ["list", "retry"]
};
//# sourceMappingURL=permissions.js.map