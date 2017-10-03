var express = require('express');
var app = express();
var mongoose = require('mongoose');
//var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var path = require('path');
//app.use(logger('dev'));

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

app.use(session({
	name:'myCustmCookie',
	secret:'myAppSecret',
	resave:true,
	httpOnly:true,
	saveUninitialized:true,
	cookie:{secure:false}
}));



app.set('view engine','jade');
app.set('views', path.join(__dirname+'/app/views'));


var dbPath  = "mongodb://localhost/edSters";
// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {
	console.log("database connection open success");
});

// fs module, by default module for file management in nodejs
var fs = require('fs');

// include all our model files
fs.readdirSync('./app/models').forEach(function(file){
	// check if the file is js or not
	if(file.indexOf('.js'))
		// if it is js then include the file from that folder into our express app using require
		require('./app/models/'+file);

});// end for each

// include controllers
fs.readdirSync('./app/controllers').forEach(function(file){
	if(file.indexOf('.js')){
		// include a file as a route variable
		var route = require('./app/controllers/'+file);
		//call controller function of each file and pass your app instance to it
		route.controller(app)

	}

});//end for each

var mongoose = require('mongoose');
var userModel = mongoose.model('User');

var auth = require('./middlewares/auth.js');
app.use(function(req, res, next){
	if(req.session && req.session.user){
		userModel.findOne({'email':req.session.user.email},	function(err,user){
			if(user){
				//req.user = user;
				//delete req.user.password;
				req.session.user = user;
				delete req.session.user.password;
				next();

			}else{
				//
			}
		});		
	} 
});

	

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});