const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workshopSchema = Schema({
    name: {type: String, required:true},
    users: [{type: String, required:false}],
    artist : {type: String, required:true},
    minAge: {type: Number, required:true}
    });

//Export the default so it can be imported
module.exports = mongoose.model("Workshop", workshopSchema);