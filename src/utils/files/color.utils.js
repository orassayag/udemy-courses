import { ColorCodeEnum } from '../../core/enums';

class ColorUtils {

    constructor() { }

    createColorMessage(data) {
        const { message, color } = data;
        if (!message) {
            return '';
        }
        return `${ColorCodeEnum[`Fg${color}`]}${message}${ColorCodeEnum.Reset}`;
    }
}

export default new ColorUtils();