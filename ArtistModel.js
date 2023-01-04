const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = Schema({
    artist: {type: String, required:true},
    artwork : [{type: String, required:true}],
    });

//Export the default so it can be imported
module.exports = mongoose.model("Artist", artistSchema);