"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const router = express_1.default.Router();
router.get('/', index_controller_1.dashboardController.index);
router.get('/profiles', index_controller_1.profileController.index);
router.post('/profiles', index_controller_1.profileController.create);
router.put('/profiles/:id', index_controller_1.profileController.edit);
router.get('/terminals', index_controller_1.terminalController.index);
router.post('/terminals', index_controller_1.terminalController.create);
router.put('/terminals/:id', index_controller_1.terminalController.update);
router.get('/auth/user', index_controller_1.authController.getUserInfo);
router.get('/auth/logout', index_controller_1.authController.logout);
exports.default = router;
//# sourceMappingURL=admin.dashboard.route.js.map