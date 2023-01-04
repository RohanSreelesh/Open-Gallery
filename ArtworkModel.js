
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arworkSchema = Schema({
    name: {type: String, required:true},
    artist : {type: String, required:true},
    year : {type: Number, required:true},
    category: {type: String, required:true},
    medium : {type: String, required:true},
    description : {type: String, required:true},
    image :{type: String, required:true},
    });

//Export the default so it can be imported
module.exports = mongoose.model("Artwork", arworkSchema);