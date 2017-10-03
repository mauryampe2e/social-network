
// defining a mongoose schema 
// including the module
var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var postSchema = new Schema({
	
	userName 			: {type:String,required:true},
	fullName  			: {type:String,default:''},
	postText			: {type:String},
	created				: {type:Date, default:Date.now()},
	modified			: {type:Date, default:Date.now()},
	comments			: [],
	totalComments		: {type:Number, default:0},
	likedBy				: [],
	totalLikes			: {type:Number, default:0},
	tags				: []
});


mongoose.model('Post',postSchema);