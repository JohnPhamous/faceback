var
  mongoose = require('mongoose'),
  Phrase = require('./../../models/Phrase');

module.exports = function(router) {
  // A GET request to /api/phrase/:url will 
  // get all the data for a phrase
  router.get('/phrase/:pageId/:phrase', function (req, res) {
    Phrase.findOne({ pageId: req.params.pageId, phrase: req.params.phrase }, function (err, phraseData) {
      if (err) {
        return res.send(err.message);
      } else if (!phraseData) {
        return res.send('No Phrase was found titled: ' + req.params.phrase);
      }

      return res.send(phraseData);
    });
  });
};
