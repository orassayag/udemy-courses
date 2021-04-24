const textUtils = require('./text.utils');

class CourseUtils {

    constructor() {
        this.murlKey = 'murl=';
        this.couponCodeKey = 'couponCode=';
        this.coursesKey = '/course/';
    }

    createCourseSingleData(url) {
        if (url.indexOf(this.murlKey) > -1) {
            url = unescape(url);
            url = url.split(this.murlKey)[1];
        }
        return {
            udemyURL: url,
            couponKey: this.getCourseCoupon(url)
        };
    }

    getCourseCoupon(url) {
        if (!url) {
            return url;
        }
        return url.split(this.couponCodeKey)[1];
    }

    getCoursePrices(text) {
        text = textUtils.removeAllNoneNumbers(text);
        return {
            priceNumber: parseFloat(text),
            priceDisplay: `₪${parseFloat(text).toFixed(2)}`
        };
    }

    getUdemyURLKeywords(udemyURL, udemyBaseURL) {
        if (!udemyURL || udemyURL.indexOf(this.coursesKey) === -1) {
            return [];
        }
        return udemyURL.replace(`${udemyBaseURL}${this.coursesKey}`, '').split('/')[0].split('-');
    }
}

module.exports = new CourseUtils();