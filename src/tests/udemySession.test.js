require('../services/files/initiate.service').initiate('test');
const PurchaseLogic = require('../logics/purchase.logic');
const { validationUtils } = require('../utils');

const urls = [
    // Example:
    // https://www.udemy.com/course/golang-restful-api-programlama/?ranMID=39197&ranEAID=nN98ER4vNAU&ranSiteID=nN98ER4vNAU-TOM4Flgl1MEnIFP1Qjadrg&utm_source=aff-campaign&utm_medium=udemyads&LSNPUBID=nN98ER4vNAU&couponCode=45CFEFD49FCDE55CDB31
];

(async () => {
    if (!validationUtils.isExists(urls)) {
        throw new Error('No URLs exists to run a session');
    }
    await new PurchaseLogic().run(urls);
})();