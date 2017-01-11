var fs = require('fs-extra');
var path = require('path');
var mv = require('mv');
var mongojs = require("mongojs");
var db = mongojs("mongodb://127.0.0.1:27017/test", ["Ads","users","TFStorage"]);
module.exports.FinalAdSubmit = function (req,res){
      
    db.Ads.insert({
       Title : req.body.Title,       
       Category:req.body.Category,       
       City : req.body.City,
       District : req.body.District,
       Description : req.body.Description,
       Name : req.body.Name,
       PhoneNo : req.body.PhoneNo,
       Email : req.body.Email,
       Price : req.body.Price,
       Created : new Date(),
       Modified : new Date(), 
       ImagePath:req.body.ImagePath
       }, function(err, doc) {
             res.json(doc);
         
     });
    
}