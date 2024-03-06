export const APP_PERMISSIONS = {
    "transactions": ['list', 'view',"print", "export", "stats"],
    "users": ['list','view', 'create', 'update', 'delete'],
    "organisations": ['list','view', 'create', 'update','view-secret','rotate-secret', 'delete'],
    "profiles": ['list','view', 'create', 'update', 'delete','rotate-keys'],
    "terminals": ['list','view', 'create', 'update',"bulk_upload", 'delete', 'export', 'trigger-keyexchange'],
    "groupTid": ['list','view', 'create', 'update','delete','trigger-keyexchange'],
    "webhook_listeners": ['list','view', 'create', 'update', 'delete'],
    "webhooks": ["list","retry"]
}