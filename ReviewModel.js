
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = Schema({
    user: {type: String, required:true},
    review : {type: String, required:true},
    artwork : {type: String, required:true},
    });

//Export the default so it can be imported
module.exports = mongoose.model("Review", reviewSchema);