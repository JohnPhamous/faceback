e = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var pageSchema = new Schema({

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

    url: {
        type: String,
        unique: true,
        required: true,
        dropDups: true,
        index: true
    },
    name: String,
    posts: [
        {
            post: {
                type: ObjectId,
                ref: 'Post'
            }
    ],

    //////////////////////
    // Timestamp Fields //
    //////////////////////

    created: Date,
    modified: {
        type: Date,
        default: Date.now
    },
    deleted: Date
    
});

module.exports = mongoose.model('Page', pageSchema); 

