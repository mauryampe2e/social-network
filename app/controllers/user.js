var mongoose = require('mongoose');
var express = require('express');

// express router // used to define routes 
var userRouter  = express.Router();
var userModel = mongoose.model('User');
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require('./../../middlewares/auth')

module.exports.controller = function(app) { 
    userRouter.get('/login/screen', function(req, res){
        res.render('login');
    }) //get login screen

    userRouter.get('/signup/screen', function(req, res){
        res.render('signup');
    }) //get signup screen

    userRouter.get('/dashboard', auth.checkLogin, function(req, res){
        res.render('dashboard',{user:req.session.user});
    }) //login screen

    userRouter.get('/logout', function(req, res){
        console.log("logout done...");
        console.log(req.session);
        req.session.destroy(function(err,success) {
            res.redirect('/users/login/screen');
        })
    }) 
    userRouter.get('/post', function(req, res){
        console.log("post req...");
        //console.log(req.session);
        res.render('post');
    })   

    userRouter.get('/all',function(req, res){
        userModel.find({},function(err, allUsers){
            if(err){
                res.send(err);
            }else{
                res.send(allUsers);
            }
        });  //end user model
        //res.send('this is route to get all user, write db code');
    })
    userRouter.get('/:userName',function(req, res){
        var username = req.params.userName;
        userModel.findOne({
            userName:username
        },function(err, user){
            if(err){
                res.send(err);
            }else{
                res.send(user);
            }
        });  //end user model
       
    })
    userRouter.post('/signup',function(req,res){

        if(req.body.firstName!=undefined && req.body.lastName!=undefined && req.body.email!=undefined && req.body.password!=undefined){
            
            var newUser = new userModel({
                userName            : req.body.firstName+''+req.body.lastName,
                firstName           : req.body.firstName,
                lastName            : req.body.lastName,
                email               : req.body.email,
                mobileNumber        : req.body.mobileNumber,
                password            : req.body.password

            });// end new user 
            
            newUser.userName = newUser.userName+
            newUser.save(function(err){
                if(err){
                    var myResponse = responseGenerator.generate(true,err,500,null);
                    //res.send(myResponse);
                    res.render('error',{
                        meassge:myResponse.message,
                        error:myResponse.data
                    });                 
                }
                else{
                    var myResponse = responseGenerator.generate(false,"successfully signup user",200,newUser);
                    //res.send(myResponse);
                    //res.render('dashboard',{ user:newUser});
                    req.session.user = newUser;
                    delete req.session.user.password;
                    console.log("signup dashboard...");
                    res.redirect('/users/dashboard');
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
        

    });//end signup api


    userRouter.post('/login',function(req,res){

        userModel.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]},function(err,foundUser){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                //res.send(myResponse);
                res.render('error',{
                        meassge:myResponse.message,
                        error:myResponse.data
                });
            }
            else if(foundUser==null || foundUser==undefined || foundUser.userName==undefined){

                var myResponse = responseGenerator.generate(true,"user not found. Check your email and password",404,null);
                //res.send(myResponse);
                res.render('error',{
                        meassge:myResponse.message,
                        error:myResponse.data
                });
            }
            else{

                var myResponse = responseGenerator.generate(false,"successfully logged in user",200,foundUser);
                //res.send(myResponse);
                //res.render('dashboard',{ user:foundUser});
                req.session.user = foundUser;
                delete req.session.user.password;
                console.log("login dashboard...");
                res.redirect('/users/dashboard');
            }

        });// end find


    });// end login api



    // now making it global to app using a middleware
   
    app.use('/users', userRouter);



 
} //end contoller code