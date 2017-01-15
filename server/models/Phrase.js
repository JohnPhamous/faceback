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

    pageId: {   //each owner has different phrases, find by pageId and phrase (2 fields needed)
        type: String,
        unique: true,
        required: true,
        dropDups: true,
        index: true
    },
    phrase: String,
    posts: [String], //post ids

    //////////////////////
    // Timestamp Fields //
    //////////////////////
    
    created: Date,
    modified: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Phrase', phraseSchema); 

