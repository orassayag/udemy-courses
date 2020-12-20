require('../services/files/initiate.service').initiate('purchase');
const PurchaseLogic = require('../logics/purchase.logic');
const { Mode } = require('../core/enums');

(async () => {
    await new PurchaseLogic().run({
        urls: null,
        mode: Mode.STANDARD
    });
})();