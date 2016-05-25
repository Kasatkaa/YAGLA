var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var schemaNews = new Schema({
	title: String,
	news: String,
	img: String,
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.connect( 'mongodb://localhost/test' );
module.exports = mongoose.model( 'News', schemaNews );