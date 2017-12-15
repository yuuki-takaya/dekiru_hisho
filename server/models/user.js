var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    userid : {type: String, require: true, unique: true},
    username : { type: String, require: true }, 
    password : { type: String,require: true},
    oauth : {type: Object} 
});

module.exports = mongoose.model('user', User);