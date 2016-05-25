var mongoose = require('mongoose');
console.log(mongoose.version);
var db = mongoose.createConnection('mongodb://localhost/spark');
//var Shema   = mongoose.Schema;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback () {
	console.log("Подключение к mongoDB выполнено успешно!")
});

var schemaNews = new mongoose.Schema({
	title: { type: String },
	url: { type: String },
	news: { type: String },
	img: { type: String },
	full: { type: String }
});

var Schemas = db.model("Schemas", schemaNews);

var showNews = function(callback) {
	Schemas.find({}, function (err, articles) {
		callback(articles);
	});
}

var save = function(post) { 

Schemas.findOne({ name: post.name }, function (err, posted) { 
if(!posted) { 
var newPost = new Schemas(post); 
newPost.save(); 
} 
});

}


module.exports.save = save;
module.exports.showNews = showNews;