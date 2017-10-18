var mongoose = require('mongoose');
var express = require('express');

// express router // used to define routes 
var postRouter = express.Router();
var postModel = mongoose.model('Post');
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require('./../../middlewares/auth');

module.exports.controller = function(app) { 

    //route to get all post
    postRouter.get('/',function(req, res){
        
        postModel.find(function(err,result){
            if(err){
                res.send(err);
            } else {
                res.send(result);
            }
        })
    });
    
    //route to get a post by _id
    postRouter.get('/:id',function(req, res){
        postModel.findOne({'_id':req.params.id},function(err,result){
            if(err){
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
    //route to get all post by userName
    postRouter.get('/:userName',function(req, res){
        var username = req.params.userName;
        postModel.find({userName:username},function(err,result){
            if(err){
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
    //route to get all post by logged in user
    postRouter.get('/loggedinUser/:userName', auth.checkLogin, function(req, res){
        postModel.find({userName:req.params.userName,tags:{$in:[req.session.user.email]}},function(err,result){
            if(err){
                res.send(err);  
            } else {
                res.send(result);
            }
        });
    });      
    //route to create a post 
    postRouter.post('/create', auth.checkLogin, function(req, res){

        if(req.session.user.email!=undefined && req.body.postText!=undefined ){
   
            var newPost = new postModel({              
                userName        : req.session.user.userName,
                postText        : req.body.postText
            });//end new user 
            newPost.tags = req.session.user.email;
            newPost.fullName = req.session.user.firstName+' '+req.session.user.lastName;
            
            newPost.save(function(err){
                if(err){
                    var myResponse = responseGenerator.generate(true,err,500,null);
                    //res.send(myResponse);
                    res.render('error',{
                        meassge:myResponse.message,
                        error:myResponse.data
                    });                 
                }
                else{
                    var myResponse = responseGenerator.generate(false,"successfully saved post",200,newPost);
                    res.send(myResponse);

                }
            });//end new user save
        }
        else{

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };
            res.send(myResponse);
        }      
    });
    //route to edit a post 
    postRouter.put('/:id/edit', auth.checkLogin, function(req, res){

        if(req.session.user.email!=undefined && req.body.postText!=undefined ){
            
            postModel.update({'_id':req.params.id},{$set: { postText:req.body.postText, userName:req.session.user.userName }},function(err,result){
                if(err){
                    res.send(err);
                }else{
                    res.send(result);
                }
            })

        } else{

            var myResponse = {
                    error: true,
                    message: "Some body parameter is missing",
                    status: 403,
                    data: null
                };
            res.send(myResponse);
        }    
    });
    //route to like a post
    postRouter.post('/like', auth.checkLogin, function(req, res){

        if(req.session.user.email!=undefined && req.body.postText!=undefined ){
   
            var newPost = new postModel({              
            });//end new user 
            var userInfo = { 
                fullName:req.session.user.firstName+' '+req.session.user.lastName, 
                userName:req.session.user.userName 
            }
            newPost.likedBy.push(userInfo);
            newPost.totalLikes = newPost.likedBy.length;
            
            newPost.save(function(err){
                if(err){
                    var myResponse = responseGenerator.generate(true,err,500,null);
                    //res.send(myResponse);
                    res.render('error',{
                        meassge:myResponse.message,
                        error:myResponse.data
                    });                 
                }
                else{
                    var myResponse = responseGenerator.generate(false,"successfully saved post",200,newPost);
                    res.send(myResponse);
                }
            });//end new user save
        }
        else{

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };
            res.send(myResponse);
        }      
    });
    //route to comment on a post
    postRouter.post('/comment', auth.checkLogin, function(req, res){

        if(req.session.user.email!=undefined && req.body.postText!=undefined ){
   
            var newPost = new postModel({              
            });//end new user 
            var userInfo = { 
                fullName:req.session.user.firstName+' '+req.session.user.lastName, 
                userName:req.session.user.userName 
            }
            newPost.likedBy.push(userInfo);
            newPost.totalLikes = newPost.likedBy.length;
            
            newPost.save(function(err){
                if(err){
                    var myResponse = responseGenerator.generate(true,err,500,null);
                    //res.send(myResponse);
                    res.render('error',{
                        meassge:myResponse.message,
                        error:myResponse.data
                    });                 
                }
                else{
                    var myResponse = responseGenerator.generate(false,"successfully saved post",200,newPost);
                    res.send(myResponse);
                    //res.render('dashboard',{ user:newUser});
                    //req.session.user = newUser;
                    //delete req.session.user.password;
                    //console.log("signup dashboard...");
                    //res.redirect('/users/dashboard');
                }
            });//end new user save


        }
        else{

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

            res.send(myResponse);
        }      
    }); 
  
    // now making it global to app using a middleware
    app.use('/users/post', postRouter);
 
} //end contoller code