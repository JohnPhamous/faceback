var
  mongoose = require('mongoose'),
  Page = require('./../../models/Page'),
  Unknown = require('../../services/Unknown');

module.exports = function(router) {
  // A GET request to /api/page/:url will 
  // get all the data for a page
  router.get('/page/:url', function (req, res) {
    Unknown
      .getPageData(req.params.url)
      .then(pageData => {
        pageData.shift();
        return res.send(pageData);
      })
  });
};
