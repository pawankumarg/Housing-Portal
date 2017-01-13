var express = require("express");
var mongojs = require("mongojs");
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var multipart = require('connect-multiparty')
var multipartmiddleware = multipart();
var fs = require('fs-extra');
var path = require('path');
var mv = require('mv');
var mailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var smsowl = require("smsowl");

var app = express();




//var db = mongojs("mongodb://127.0.0.1:27017/test", ["properties","users"]);
var db = mongojs("mongodb://127.0.0.1:27017/test", ["properties","users","appliances","counters","beauty","shortlist","contactus","Members","Ads"]);

app.use(express.static(__dirname + '/public')); 
app.use('/app',express.static(__dirname + "/public/app"));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/jso                                                                 n
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cookieParser('yousecretcode'));
app.use(expressSession({secret: 'yourothersecretcode', saveUninitialized: true, resave: true}));

app.use(require('prerender-node').set('prerenderToken', 'RQipy0ZvqrfpO3lTJnlQ')); 
var sm = require('sitemap'); 
var sitemap = sm.createSitemap ({
      hostname: 'http://www.easehousing.com',
      cacheTime: 600000,        // 600 sec - cache purge period 
      urls: [
        { url: '/',  changefreq: 'weekly', priority: 1.0 },
        { url: '/searchproperty',  changefreq: 'weekly',  priority: 1.0 },
        { url: '/beauty', changefreq: 'weekly',  priority: 1.0},    
        { url: '/classifieds',   changefreq: 'weekly',  priority: 0.8 },
        { url: '/repair',   changefreq: 'weekly',  priority: 1.0 },
        { url: '/signup',   changefreq: 'weekly',  priority: 0.8 },
        { url: '/contactus',   changefreq: 'monthly',  priority: 0.6 },
        { url: '/beamember',   changefreq: 'monthly',  priority: 0.6 }
      ]
    });
 
app.get('/sitemap.xml', function(req, res) {
  sitemap.toXML( function (err, xml) {
      if (err) {
        return res.status(500).end();
      }
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });
});

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /accountactivation\nDisallow: /userslist\nDisallow: /AllContactUs");
});




smsowl.configure({
    accountId: "574d607e4e95e71c545acacc",
    apiKey: "sSLeho5awGgTEX5okFkj4DaDF6s3cGzExCqiKYSFzkzyesuoeWu"
});

app.post('/api/sendpromosms',function(req,res){
smsowl.sendPromotionalSms("TESTER",["+91"+req.body.PhoneNo],req.body.Message,"normal",function(error,result){
    if(error){
        res.send(error);
    }else{
        res.send(result);
    }
});
})



app.get('/api/allproperties/:WantTo', function(req, res) {
       
        db.properties.find({'Purpose':req.params.WantTo}).sort({Created:-1}).limit(20,function(err, doc) {
            res.json(doc);            
        });
    });

app.get('/api/allclassifieds', function(req, res) {

        db.Ads.find().sort({Created:-1}).limit(20,function(err, doc) {
            res.json(doc);            
        });
    });

app.get('/api/filterproperties/:SearchProp/:Buy/:Rent/:Min/:Max/:Type/:lastId', function(req, res) {
        var query = {};

        query["$and"]=[];
        if(req.params.SearchProp != "SP")
        {
          query["$and"].push({"$or": [{'Title':{'$regex' : '.*' + req.params.SearchProp + '.*'}},
                                    {'BuiltupArea':{'$regex' : '.*' + req.params.SearchProp + '.*'}},
                                    {'Society':{'$regex' : '.*' + req.params.SearchProp + '.*'}},
                                    {'Description':{'$regex' : '.*' + req.params.SearchProp + '.*'}},
                                    {'Builder':{'$regex' : '.*' + req.params.SearchProp + '.*'}},
                                    {'Purpose':{'$regex' : '.*' + req.params.SearchProp + '.*'}},
                                    {"Location":{'$regex' : '.*' + req.params.SearchProp + '.*'}}
                                   ]});
        }     
        query["$and"].push({"TotalCost":{$gte: parseInt(req.params.Min),$lte: parseInt(req.params.Max)}});
        if(req.params.Buy != "B")
        {
          query["$and"].push({"Purpose":req.params.Buy});
        }
        if(req.params.Rent != "R")
        {
          query["$and"].push({"Purpose":req.params.Rent});
        }
        if(req.params.Type != "T")
        {
          query["$and"].push({"Type":req.params.Type});
        }
        query["$and"].push({"Created":{$lt:new Date(req.params.lastId)}});


        db.properties.find(query).sort({Created:-1}).limit(20,function(err, docs) {

                res.json(docs);           
        });
    });

app.get('/api/properties/:SearchProp', function(req, res) {

        db.properties.find({"$or": [{'Title':{'$regex' : req.params.SearchProp, '$options':'i'}},
                                    {'BuiltupArea':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {'Society':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {'Description':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {'Builder':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {'Purpose':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {"Location":{'$regex' : req.params.SearchProp, '$options':'i'}}
                                   // {"Location":{'$regex' : '.*' + req.params.SearchProp + '.*'}}
                                   ]}).sort({Created:-1}).limit(20,function(err, docs) {          
                res.json(docs);            
        });
    });

app.get('/api/refineproperties/:SearchProp/:WantTo/:Min/:Max/:Type', function(req, res) {

        var query = {};

        query["$and"]=[];
        if(req.params.SearchProp != "SP")
        {
          query["$and"].push({"$or": [{'Title':{'$regex' : req.params.SearchProp, '$options':'i'}},
                                    {'BuiltupArea':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {'Society':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {'Description':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {'Builder':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {'Purpose':{'$regex' :  req.params.SearchProp, '$options':'i'}},
                                    {"Location":{'$regex' : req.params.SearchProp, '$options':'i'}}
                                   ]});
        }     
        query["$and"].push({"TotalCost":{$gte: parseInt(req.params.Min),$lte: parseInt(req.params.Max)}});
        if(req.params.WantTo != "B")
        {
          query["$and"].push({"Purpose":req.params.WantTo});
        }   
        if(req.params.Type != "T")
        {
          query["$and"].push({"Type":req.params.Type});
        }
        console.log(query);
       
        db.properties.find(query).sort({Created:-1}).limit(20,function(err, docs) {
         
                res.json(docs);           
    })
    });

app.get('/api/refineads/:SearchAd/:Category', function(req, res) {

        var query = {};

        query["$and"]=[];
        console.log(req.params.SearchAd);
        if(req.params.SearchAd != "SP")
        {
          query["$and"].push({"$or": [{'Title':{'$regex' : req.params.SearchAd, '$options':'i'}},
                                    {'City':{'$regex' :  req.params.SearchAd, '$options':'i'}},
                                    {'District':{'$regex' :  req.params.SearchAd, '$options':'i'}},
                                    {'Name':{'$regex' :  req.params.SearchAd, '$options':'i'}}                                   
                                   ]});
        }           
        if(req.params.Category != "C")
        {
          query["$and"].push({"Category":req.params.Category});
        }
       
        console.log(query);
       
        db.Ads.find(query).sort({Created:-1}).limit(20,function(err, docs) {
         
                res.json(docs);           
    })
    });


var UploadPhotoController = require('./public/js/controller/Server/UploadPhotoServer.js');
var UploadAdsPhotoController = require('./public/js/controller/Server/UploadAdsPhotoServer.js');
var UpdateTempDataController = require('./public/js/controller/Server/UploadPhotoServer.js');
var SubmitPropertyController = require('./public/js/controller/Server/SubmitPropertyServer.js');
var SubmitAdsController = require('./Server/SubmitAdsServer.js');
var EditPropertyPhotoController = require('./public/js/controller/Server/EditPropertyPhotoServer.js');
app.post('/api/FinalSellRentSubmit',SubmitPropertyController.FinalSubmit);
app.post('/api/FinalAdsSubmit',SubmitAdsController.FinalAdSubmit);
 
app.post('/api/properties',multipartmiddleware,UploadPhotoController.uploadPhoto);
app.post('/api/AdsPhoto',multipartmiddleware,UploadAdsPhotoController.uploadPhoto);
app.post('/api/EditPropertyPhoto',multipartmiddleware,EditPropertyPhotoController.uploadPhoto);
app.post('/api/UpdateTempImgData', UpdateTempDataController.updateTFStorage);
 
/*app.post('/api/properties', multipartmiddleware,function(req, res) {

        var file = req.files.file;
          var userId = req.body.userId;
          var targetPathArr = [];

          for(var i=0;i<file.length;i++){
            var tempPath = file[i].path;
            var targetPath = path.join(__dirname +"/public/img/uploads/" + i + file[i].name );
            var str = "Image" + i;
            targetPathArr.push({
                src: "/img/uploads/" + i + file[i].name
            });

            mv(tempPath, targetPath, function(err) {
          if (err) { throw err; }
          
        });
          }



         db.properties.insert({
          Title : req.body.Title,
          BuiltupArea : req.body.BuiltupArea,
          Rate : req.body.Rate,
          TotalCost:parseInt(req.body.BuiltupArea) * parseInt(req.body.Rate),
          Type:req.body.Type,
          Society : req.body.Society,
          //Highlights : req.body.Highlights,
          Description : req.body.Description,
          Builder : req.body.Builder,
          PhoneNo : req.body.PhoneNo,
          Email : req.body.Email,
          Created : new Date(),
          Modified : new Date(),
          Purpose : req.body.Purpose,
          Location: req.body.Location,
          ImagePath:targetPathArr
          }, function(err, doc) {
           //console.log(res.json(doc));
           //console.log(res.json(err));
                res.json(doc);
            
        });

    });*/

app.post('/api/user/login', function(req,res){
  db.users.find({$and: [{"email":req.body.email},{"password":req.body.password},{"isActive":1}]}, function(err,result){
    if(err){console.log("Error in login")
      res.json(err);
  }
    if(result && result.length === 1){
      var userData = result[0];
      res.json({email: req.body.email, _id : userData._id});
    }
    else{
      res.send("User not authenticated");
    }

  })
})

app.get('/api/user/getUser/:email',function(req,res){
  console.log(req.params.email);
  db.users.find({"email":req.params.email}, function(err,result){
    console.log(result);
    if(result)
    {
      res.json(result);
    }
  })
})

app.post('/api/user/signup', function(req,res){

  db.users.findOne({"email":req.body.email}, function(err,result){

  if(result)  
  {
    res.json("Exists");
  }
  else
  {
    db.users.insert({
        email:req.body.email,
        password:req.body.password,
        isActive:0,
        isAdmin:0
      }, function(err,result){
      if(err){console.log("Error in signup")
        res.json(err);
    }
    console.log(result);
      if(result){
       // console.log(result.email);
        var transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: '', // Your email id
            pass: '' // Your password
        }
    });


    var mail = {
        from: "",
        to: result.email,
        subject: "easeHousing: Account Activation email",
        text: "Thank you for your interest in easeHousing.",
        html: "Thank you for your interest in easeHousing. Please click on link below inorder to activate your account.<br /> <a href='http://www.easehousing.com/accountactivation:"+result._id +"'>Activation Link</a>"
    }

    transporter.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " );
        }

        transporter.close();
    });


        res.json(result);

      }

    });
  }
  });
})

app.put('/api/accountactivation/:id',function(req,res){
  console.log(req.params.id);
  var id = req.params.id.toString();



  db.users.update({_id:mongojs.ObjectId(id)},
      { 
      $set :{isActive:1}
    }, function(err,result){
   
      res.send("Your account is activated");
})
});

app.put('/api/user/signup/:email',function(req,res){

   db.users.update({email:req.params.email},
      { 
      email:req.params.email,password:req.body.password,address:req.body.address,city:req.body.city
    }, function(err,result){
   
      res.json(result);
   
   

  })
})


app.put('/api/updateproperty/:id', function(req, res) {
         db.properties.update({_id:mongojs.ObjectId(req.params.id)},
          {$set:{Title : req.body.Title,
             BuiltupArea : req.body.BuiltupArea,
             Rate : req.body.Rate,
             TotalCost:parseInt(req.body.BuiltupArea) * parseInt(req.body.Rate),
             Type:req.body.Type,
             Address : req.body.Address,
             City : req.body.City,
             Description : req.body.Description,
             Builder : req.body.Builder,
             PhoneNo : req.body.PhoneNo,
             Email : req.body.Email,
             Modified : new Date(),
             Purpose : req.body.Purpose,
             Location: req.body.Location,
             Iam: req.body.Iam,
             Amenities:req.body.Amenities,
             Website:req.body.Website,
             ImagePath:req.body.ImagePath
             
          }},function(err, doc) {
                res.json(doc);
            
        });

    });

app.delete('/api/properties/:id', function(req, res) {

        db.properties.remove({_id: mongojs.ObjectId(req.params.id.toString())},function(err,doc){
          res.json(doc);
        });

    });

app.delete('/api/DeleteAd/:id', function(req, res) {

        db.Ads.remove({_id: mongojs.ObjectId(req.params.id.toString())},function(err,doc){
          res.json(doc);
        });

    });

app.get('/api/propertyCount', function(req, res) {
      db.properties.count(function(error,count){
        res.json(count);
      });
    });

app.get('/api/appliancesCount', function(req, res) {
      db.appliances.count(function(error,count){
        res.json(count);
      });
    });

app.get('/api/beautyCount', function(req, res) {
      db.beauty.count(function(error,count){
        res.json(count);
      });
    });

app.get('/api/adsCount', function(req, res) {
      db.Ads.count(function(error,count){
        res.json(count);
      });
    });

app.get('/api/getPropertyByID/:id', function(req, res) {
       db.properties.findAndModify({
        query:{_id:mongojs.ObjectId(req.params.id)},
        update:{$inc:{Views:1}},
        new:true
        },function(err,doc){
        
      });

        db.properties.findOne({"_id":mongojs.ObjectId(req.params.id)},function(err, doc) {
          
                res.json(doc);
            
        });

    });

app.get('/api/getClassifiedByID/:id', function(req, res) {     

        db.Ads.findOne({"_id":mongojs.ObjectId(req.params.id)},function(err, doc) {
          
                res.json(doc);
            
        });

});

app.put('/api/FinalAdsEdit',function(req,res){
  db.Ads.update({_id:mongojs.ObjectId(req.body._id)},{
       $set:{ Title : req.body.Title,       
       Category:req.body.Category,       
       City : req.body.City,
       District : req.body.District,
       Description : req.body.Description,
       Name : req.body.Name,
       PhoneNo : req.body.PhoneNo,
       Email : req.body.Email,
       Price : req.body.Price,       
       Modified : new Date(), 
       ImagePath:req.body.ImagePath
       }}, function(err, doc) {
             res.json(doc);
         
     });

})


app.post('/api/reportApplianceIssue',function(req,res){
db.counters.findAndModify({
    query:{_id:"applianceID"},
    update:{$inc:{seq:1}},
    new:true
  },function(err,doc){
    if(doc)
    {
        db.appliances.insert({
          _id:doc.seq,
          Appliance:req.body.appliance,
          Specification:req.body.product,
          Issue:req.body.issue,
          AppointmentDate:req.body.appointmentDate,
          UserName:req.body.name,
          UserPhone:req.body.phone,
          UserEmail:req.body.email,
          UserAddress:req.body.address,
          UserCity:req.body.city
        },function(err,doc){          
          res.json(doc);

        })
    }
  });
})

app.post('/api/bookBeautyAppointment',function(req,res){
/*
db.counters.insert({
  _id:"BeautyID",
  seq:0});
*/
db.counters.findAndModify({
    query:{_id:"BeautyID"},
    update:{$inc:{seq:1}},
    new:true
  },function(err,doc){
    if(doc)
    {
        db.beauty.insert({
          _id:doc.seq,
          Package:req.body.package,
          Detail:req.body.detail,
          AppointmentDate:req.body.appointmentDate,
          UserName:req.body.name,
          UserPhone:req.body.phone,
          UserEmail:req.body.email,
          UserAddress:req.body.address,
          UserCity:req.body.city
        },function(err,doc){
          res.json(doc);
        })
    }
  });
})

app.get("/api/getUsersList",function(req,res){
  db.users.find(function(err,docs){
    res.json(docs);
  });
})

app.delete("/api/deleteUser/:id",function(req,res){
  db.users.remove({_id: mongojs.ObjectId(req.params.id.toString())},function(err,doc){
    res.json(doc);
  })
})

app.post('/api/submitContact',function(req,res){

        db.contactus.insert({
          Name:req.body.Name,
          Phone:req.body.PhoneNo,
          Email:req.body.Email,
          Message:req.body.Message,
          Created : new Date()
        },function(err,doc){
          res.json(doc);
        })
 

})

app.get('/api/getContactUs',function(req,res){
  db.contactus.find().sort({Created:-1},function(err,docs){
    res.json(docs);
  });
})

app.delete("/api/deleteContact/:id",function(req,res){
  db.contactus.remove({_id: mongojs.ObjectId(req.params.id.toString())},function(err,doc){
    res.json(doc);
  })
})

app.post('/api/submitMember',function(req,res){

        db.Members.insert({
          Name:req.body.name,
          Phone:req.body.phone,
          Email:req.body.email,
          Skills:req.body.Skills,
          Created : new Date()
        },function(err,doc){
          res.json(doc);
        })
 

})

app.post("/api/addShortlist",function(req,res){
  if(req.body.shortlist==1)
  {
    db.shortlist.insert({Email:req.body.email,
    PropertyId:req.body.propertyId,
    shortlist:req.body.shortlist},function(err,doc){
      res.json(doc);
    })
  }
  else
  {
    db.shortlist.remove({$and:[{Email:req.body.email},
    {PropertyId:req.body.propertyId}]},
    function(err,doc){
      console.log(doc);
      res.json(doc);
    })
  }
})

app.get('/api/getShortlists/:email',function(req,res){
  db.shortlist.find({$and:[{Email:req.params.email},{shortlist:1}]},{PropertyId:1,_id:0},function(err,docs){
    //console.log(docs.PropertyId);
    res.json(docs);
  });
})

app.post('/api/getShortlistedProperty',function(req,res){
  var arr = [];
  console.log(req.body);
  for(var i=0;i<req.body.length;i++)
  {
    console.log(req.body[i]);
    arr.push(mongojs.ObjectId(req.body[i]));
  }

  db.properties.find({_id:{$in:arr}},function(err,docs){
    console.log(docs);
    res.json(docs);
  });
})

//--------------Passport authentication -------------------------
var configAuth = require('./config/auth.js');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new Strategy({
     clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'emails']
  },
  function(accessToken, refreshToken, profile, cb) {

db.users.findOne({"email":profile.emails[0].value}, function(err,oldUser){
    console.log(oldUser);
    if(oldUser)
    {
      cb(null,oldUser);
    }
    else
    {
       db.users.insert({
        email:profile.emails[0].value,
        socialId:profile.id,
        isActive:1,
        isAdmin:0
      },function(err,newUser){
        if(newUser)
        {
          cb(null,newUser)
        }

      });
    }

  })

  //return cb(null, profile);
  }));

passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
   
  },
  function(accessToken, refreshToken, profile, cb) {

db.users.findOne({"email":profile.emails[0].value}, function(err,oldUser){
    console.log(oldUser);
    if(oldUser)
    {
      cb(null,oldUser);
    }
    else
    {
       db.users.insert({
        email:profile.emails[0].value,
        socialId:profile.id,
        isActive:1,
        isAdmin:0
      },function(err,newUser){
        if(newUser)
        {
          cb(null,newUser)
        }

      });
    }

  })

  //return cb(null, profile);
  }));


passport.serializeUser(function(user, cb) {
  cb(null, user.email);
});

passport.deserializeUser(function(email, cb) {
  db.users.findOne({"email":email}, function(err,user){
    cb(null, user);
  })
  
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  function(req, res) {
    res.send('Success');
  });

app.get('/login',
  function(req, res){
    res.send('Success');
  });

app.post('/api/setURL',function(req,res){
  req.session.redirectURL = req.body.redirectURL;
  res.send(req.session.redirectURL);  
});

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { scope: ['email'] }),
  function(req, res,redirectURL) {
    req.session.mySession = req.user;
    res.redirect(req.session.redirectURL);  
  });

app.get('/login/google',
  passport.authenticate('google', { scope: ['email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { scope: ['profile','email'] }),
  function(req, res,redirectURL) {
    req.session.mySession = req.user;
    res.redirect(req.session.redirectURL);  
  });

  app.get('/api/logout', function(req, res) {
       req.session.mySession = null;
       res.json({success:"Success"});
  });

  app.get('/api/getSocialId', function(req, res) {     
      res.json(req.session.mySession);
  });
//--------------Passport authentication End-------------------------


app.get('/*', function(req, res) {
        res.sendFile("index.html",{root:__dirname+'/public'}); // load the single view file (angular will handle the page changes on the front-end)
    });

app.use(session({
    secret: 'keyboard cat',
    name: 'connect.sid',
    //store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



