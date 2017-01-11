var fs = require('fs-extra');
var path = require('path');
var mv = require('mv');
var mongojs = require("mongojs");
var db = mongojs("mongodb://127.0.0.1:27017/test", ["properties","users","TFStorage"]);
module.exports.FinalSubmit = function (req,res){
    
     var file = req.body.arrToUpload;
       var targetPathArr = [];
       if(file!=null)
       {
       for(var i=0;i<file.length;i++){
           //console.log("directory name "+__dirname)
         var tempPath = path.join(__dirname ,"../../../"+file[i].src);
           //console.log("Temp path "+tempPath)
         var targetPath = path.join(__dirname ,"../../../img/uploads/"+ file[i].src.split('/TempUpload/')[1] );
         //var str = "Image" + i;
         targetPathArr.push({
             src: "/img/uploads/" +file[i].src.split('/TempUpload/')[1]
         });

         mv(tempPath, targetPath, function(err) {
       if (err) { throw err; }
       
     });
       }
     }
    
   db.properties.insert({
       Title : req.body.Title,
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
       Created : new Date(),
       Modified : new Date(),
       Purpose : req.body.Purpose,
       Location: req.body.Location,
       Iam: req.body.Iam,
       Latitude:req.body.Latitude,
       Longitude:req.body.Logitude,
       MapAddress:req.body.MapLocationAddress,
       Amenities:req.body.Amenities,
       Website:req.body.Website,
       Views:0,
       ImagePath:targetPathArr
       }, function(err, doc) {
             res.json(doc);
         
     });
    
}