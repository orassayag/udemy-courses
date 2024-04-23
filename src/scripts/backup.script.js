import errorScript from './error.script.js';
import initiateService from '../services/files/initiate.service.js';
import BackupLogic from '../logics/backup.logic.js';
initiateService.initiate('backup');

(async () => {
  await new BackupLogic().run();
})().catch((e) => errorScript.handleScriptError(e, 1));
