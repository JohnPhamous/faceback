var
  mongoose = require('mongoose'),
  Post = require('./../../models/Post');

module.exports = function(router) {
  // A GET request to /api/post/:url will 
  // get all the data for a page
  router.get('/post/:url', function (req, res) {
    Post.findOne({ url: req.params.url }, function (err, postData) {
      if (err) {
        return res.send(err.message);
      } else if (!postData) {
        return res.send('No Post was found at url: ' + req.params.url);
      }

      return res.send(postData);
    });
  });
};
