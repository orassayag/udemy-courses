import kill from 'tree-kill';
import logUtils from './log.utils.js';

class SystemUtils {
  constructor() {}

  exit(exitReason, color, code) {
    logUtils.logColorStatus({
      status: this.getExitReason(exitReason),
      color: color,
    });
    process.exit(code);
  }

  getExitReason(exitReason) {
    if (!exitReason) {
      return '';
    }
    return `EXIT: ${exitReason}`;
  }

  getErrorDetails(error) {
    let errorText = '';
    if (!error) {
      return errorText;
    }
    if (error.message) {
      errorText += error.message;
    }
    if (error.stack) {
      errorText += error.stack;
    }
    return errorText;
  }

  killProcess(pid) {
    if (pid) {
      kill(pid);
    }
  }
}

export default new SystemUtils();
