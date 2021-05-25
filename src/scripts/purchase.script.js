const errorScript = require('./error.script');
require('../services/files/initiate.service').initiate('purchase');
const PurchaseLogic = require('../logics/purchase.logic');
try {
    new PurchaseLogic().run();
}
catch (error) {
    errorScript.handleScriptError(error);
}