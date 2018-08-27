const sourceListData = require('../Fixtures/sourceList.json');
const newsListData = require('../Fixtures/newsList.json');

export default {
  // Functions return fixtures
  getSources: () => ({
    ok: true,
    data: sourceListData,
  }),

  getNews: () => {
    const newsData = newsListData;
    // const sourceData = sourceListData;
    return {
      ok: true,
      data: newsData,
    };
  },
};
