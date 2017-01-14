var
  mongoose = require('mongoose'),
  Page = require('./../../models/Page');

module.exports = function(router) {
  // A GET request to /api/page/:url will 
  // get all the data for a page
  router.get('/page/:url', function (req, res) {
    Page.findOne({ url: req.params.url }, function (err, pageData) {
      if (err) {
        return res.send(err.message);
      } else if (!pageData) {
        return res.send('No Page was found at url: ' + req.params.url);
      }

      return res.send(pageData);
    });
  });
};