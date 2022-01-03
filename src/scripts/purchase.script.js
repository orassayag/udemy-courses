import errorScript from './error.script';
import initiateService from '../services/files/initiate.service';
import PurchaseLogic from '../logics/purchase.logic';
initiateService.initiate('purchase');

try {
    new PurchaseLogic().run();
}
catch (error) {
    errorScript.handleScriptError(error);
}