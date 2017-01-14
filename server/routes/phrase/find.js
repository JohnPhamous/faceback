var
  mongoose = require('mongoose'),
  Page = require('./../../models/Phrase');

module.exports = function(router) {
  // A GET request to /api/phrase/:url will 
  // get all the data for a phrase
  router.get('/phrase/:phrase', function (req, res) {
    Phrase.findOne({ phrase: req.params.phrase }, function (err, phraseData) {
      if (err) {
        return res.send(err.message);
      } else if (!phraseData) {
        return res.send('No Phrase was found titled: ' + req.params.phrase);
      }

      return res.send(phraseData);
    });
  });
};
