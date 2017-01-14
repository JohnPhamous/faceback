/////////////////
// Phrase model //
//////////////////

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var phraseSchema = new Schema({

    ////////////////////
    // MongoDB Fields //
    ////////////////////

    _id: {
        type: ObjectId,
        auto: true
    },
    __v: {
        type: Number,
        select: false
    },

    ////////////////////
    // Default Fields //
    ////////////////////

    phrase: {
        type: String,
        unique: true,
        required: true,
        dropDups: true,
        index: true
    },
    posts: [String], //URLs

    //////////////////////
    // Timestamp Fields //
    //////////////////////

    created: Date,
    modified: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Page', pageSchema); 

