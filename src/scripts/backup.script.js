import errorScript from './error.script';
import initiateService from '../services/files/initiate.service';
import BackupLogic from '../logics/backup.logic';
initiateService.initiate('backup');

(async () => {
    await new BackupLogic().run();
})().catch(e => errorScript.handleScriptError(e, 1));