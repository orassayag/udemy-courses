import {
  fileUtils,
  pathUtils,
  textUtils,
  validationUtils,
} from '../../utils/index.js';

class FileService {
  constructor() {}

  async getJSONFileData(data) {
    const { environment, path, parameterName, fileExtension } = data;
    const filePath = `${path}account-${textUtils.toLowerCase(
      environment
    )}.json`;
    if (!(await fileUtils.isPathExists(filePath))) {
      throw new Error(`Path not exists: ${filePath} (1000009)`);
    }
    if (!fileUtils.isFilePath(filePath)) {
      throw new Error(
        `The parameter path ${parameterName} marked as file but it's a path of a directory: ${filePath} (1000010)`
      );
    }
    const extension = pathUtils.getExtension(filePath);
    if (extension !== fileExtension) {
      throw new Error(
        `The parameter path ${parameterName} must be a ${fileExtension} file but it's: ${extension} file (1000011)`
      );
    }
    const fileData = await fileUtils.read(filePath);
    const jsonData = JSON.parse(fileData);
    if (!validationUtils.isExists(jsonData)) {
      throw new Error(`No data exists in the file: ${filePath} (1000012)`);
    }
    return jsonData;
  }
}

export default new FileService();
