import randomUseragent from 'random-useragent';

class CrawlUtils {
  constructor() {}

  getRandomUserAgent() {
    return randomUseragent.getRandom();
  }
}

export default new CrawlUtils();
