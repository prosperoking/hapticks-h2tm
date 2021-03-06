import VasTransactionController from './vas.controller';
import AuthController from './auth.controller';
import RoutingContoller from './routing.controller';
import IsoCardController from './iso_card.controller';
import DashboardController from './dashboard.controller';
import ProfileController from './profiles.controller';
import TerminalController from './terminal.controller';


const vasTransactionController = new VasTransactionController();

const authController = new AuthController();
const routingContoller = new RoutingContoller();
const isoCardController = new IsoCardController();
const dashboardController = new DashboardController();
const profileController = new ProfileController();
const terminalController = new TerminalController();

export {
    vasTransactionController, 
    authController, 
    routingContoller,
    isoCardController,
    dashboardController,
    terminalController,
    profileController,
}