const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = Schema({
    user: {type: String, required:true},
    followed : [{type: String, required:true}],
    });

//Export the default so it can be imported
module.exports = mongoose.model("Follow", followSchema);