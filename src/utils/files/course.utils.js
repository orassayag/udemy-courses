const textUtils = require('./text.utils');

class CourseUtils {

    constructor() { }

    getCourseSingleData(url) {
        url = unescape(url);
        url = url.split('murl=')[1];
        return {
            udemyURL: url,
            couponKey: this.getCourseCoupon(url)
        };
    }

    getCourseCoupon(url) {
        if (!url) {
            return url;
        }
        return url.split('couponCode=')[1];
    }

    getCoursePrices(text) {
        text = textUtils.removeAllNonNumbers(text);
        return {
            priceNumber: parseFloat(text),
            priceDisplay: `₪${parseFloat(text).toFixed(2)}`
        };
    }

    getUdemyURLKeyWords(udemyURL, udemyBaseURL) {
        if (!udemyURL) {
            return [];
        }
        const courseKeyWord = '/course/';
        if (udemyURL.indexOf(courseKeyWord) === -1) {
            return [];
        }
        return udemyURL.replace(`${udemyBaseURL}${courseKeyWord}`, '').split('/')[0].split('-');
    }
}

module.exports = new CourseUtils();