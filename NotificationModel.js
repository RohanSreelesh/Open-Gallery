const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = Schema({
    user: {type: String, required:true},
    notifs : [{type: String, required:false}],
    artist : {type: String, required:true},
    });


//Export the default so it can be imported
module.exports = mongoose.model("Notifs", notificationSchema);