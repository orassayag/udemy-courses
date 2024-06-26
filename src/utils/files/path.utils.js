import path from 'path';

class PathUtils {
  constructor() {}

  getJoinPath(data) {
    const { targetPath, targetName } = data;
    // Check if the targetPath parameter was received.
    if (!targetPath) {
      throw new Error(`targetPath not received: ${targetPath} (1000031)`);
    }
    // Check if the fileName parameter was received.
    if (!targetName) {
      throw new Error(`targetName not received: ${targetName} (1000032)`);
    }
    return path.join(targetPath, targetName);
  }

  getDirName(targetPath) {
    return path.dirname(targetPath);
  }

  getBasename(source) {
    return path.basename(source);
  }

  getExtension(targetPath) {
    return path.extname(targetPath);
  }
}

export default new PathUtils();
