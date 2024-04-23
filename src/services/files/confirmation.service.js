import readline from 'readline';
import logService from './log.service.js';
import { logUtils } from '../../utils/index.js';

class ConfirmationService {
  constructor() {}

  setRawMode(value) {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(value);
    }
  }

  confirm(settings) {
    logUtils.log(logService.createConfirmSettingsTemplate(settings));
    readline.emitKeypressEvents(process.stdin);
    this.setRawMode(true);
    return new Promise((resolve, reject) => {
      try {
        process.stdin.on('keypress', (chunk, key) => {
          if (chunk) {
          }
          resolve(key && key.name === 'y');
          this.setRawMode(false);
        });
      } catch (error) {
        this.setRawMode(false);
        reject(false);
      }
    }).catch();
  }
}

export default new ConfirmationService();
