/////////////////
// Post model //
//////////////////

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var postSchema = new Schema({

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

    postId: {
        type: String,
        unique: true,
        required: true,
        dropDups: true,
        index: true
    },
    text: String,
    pageId: String,
    phrases: [String], 
    comments: [String], //(?not used yet) most common key words from comments
    like: Number,
    love: Number,
    haha: Number,
    wow: Number,
    sad: Number,
    angry: Number,     
    //////////////////////
    // Timestamp Fields //
    //////////////////////
    
    date: Date,
    created: Date,
    modified: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Post', postSchema); 

