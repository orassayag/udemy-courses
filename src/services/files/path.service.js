import { PathDataModel } from '../../core/models';

class PathService {

    constructor() {
        this.pathDataModel = null;
    }

    initiate(settings) {
        this.pathDataModel = new PathDataModel(settings);
    }
}

export default new PathService();