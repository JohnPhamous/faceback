var
  mongoose = require('mongoose'),
  Post = require('./../../models/Post');

module.exports = function(router) {
  // A GET request to /api/post/:postId will 
  // get all the data for a page
  router.get('/post/:postId', function (req, res) {
    Post.findOne({ postId: req.params.postId }, function (err, postData) {
      if (err) {
        return res.send(err.message);
      } else if (!postData) {
        return res.send('No Post was found at id: ' + req.params.postId);
      }

      return res.send(postData);
    });
  });
};
