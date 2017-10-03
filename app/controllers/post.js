var mongoose = require('mongoose');
var express = require('express');

// express router // used to define routes 
var postRouter = express.Router();
var postModel = mongoose.model('Post');
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require('./../../middlewares/auth');

module.exports.controller = function(app) { 
    postRouter.get('/',function(req, res){
        //console.log("all post by user ");
        //res.send("all the post by user ");
        postModel.find(function(err,result){
            if(err){
                res.send(err);
            } else {
                res.send(result);
            }
        })
    });
    //get particular Blogs by id
    postRouter.get('/:id',function(req, res){
        postModel.findOne({'_id':req.params.id},function(err,result){
            if(err){
                res.send(err);
            } else {
                res.send(result);
            }
        })
    })
    postRouter.post('/comments',function(req, res){
        var postInfo = {
                "userName":req.session.user.userName,
                "fullName":req.session.user.userName
            }
        //newPost.likedBy = newPost.push(postInfo); 
        console.log(req.session.user);   

    })
    postRouter.post('/create', function(req, res){
         console.log("create: "+req.session.user);
        if(req.body.postText!=undefined && req.session.user.email!=undefined){

            var newPost = new postModel({
               
                postText        :req.body.postText,
                email           :req.session.user.email
                
            });// end new post
            
            //console.log("cDreate: "+req.session.user);
            //var totalComments =  req.session.user.totalComments;
            //var totalLikes =  req.session.user.totalLikes;
           
            ///newPost.comments = newPost.push(userinfo);
            //newPost.totalComments = totalComments++;
            //newPost.totalComments = totalLikes++;
            //newPost.likedBy = newPost.push(postInfo);

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
                    var myResponse = responseGenerator.generate(false,"successfully signup user",200,newPost);
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
                message: "Some data is missing that is required to post",
                status: 403,
                data: null
            };

            res.send(myResponse);

            

        }
    })
    postRouter.put('/:id/edit',function(req, res){
        var update = req.body;
        postModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
            if(err){
                res.send(err);
            }else{

                res.send(result);
            }
        });
        
    })


    // now making it global to app using a middleware
   
    app.use('/users/post', postRouter);
 
} //end contoller code