import errorScript from './error.script.js';
import initiateService from '../services/files/initiate.service.js';
import PurchaseLogic from '../logics/purchase.logic.js';
initiateService.initiate('purchase');

try {
  new PurchaseLogic().run();
} catch (error) {
  errorScript.handleScriptError(error);
}
