var fs = require('fs-extra');
var path = require('path');
var mv = require('mv');
var mongojs = require("mongojs");
var db = mongojs("mongodb://127.0.0.1:27017/test", ["properties","users","TFStorage"]);


module.exports.uploadPhoto = function (req,res){

    var file = req.files.file;
    var targetPathArr = [];
    if(req.body.ImagePath!=null && req.body.ImagePath.length > 0)
    {
      for(var i=0;i<req.body.ImagePath.length;i++)
      {
        if(req.body.ImagePath[i].src != null && req.body.ImagePath[i].src != '')
        {
          targetPathArr.push({src:req.body.ImagePath[i].src})
        }
      }
    }
    for (var i = 0; i < file.length; i++) {
        var tempPath = file[i].path;
        
        var targetPath = path.join(__dirname ,"../../../img/Ads/" + i + file[i].name);
        
        var str = "Image" + i;
        
        targetPathArr.push({
            src: "/img/Ads/" + i + file[i].name
        });
        console.log(req.body.ImagePath);
        mv(tempPath, targetPath, function (err) {
            if (err) { throw err; }

        });
    }
    db.TFStorage.insert({      
        ImagePath: targetPathArr
    }, function (err, doc) {
      console.log(err);
        res.send(doc)

    });
}

module.exports.updateTFStorage = function (req,res){
    
    db.TFStorage.update(
       { _id: mongojs.ObjectId(req.body[0].Id) },
       {
           $set: {
               "ImagePath": req.body[0].AllSrc
           }

       }, function (err, docs) {
           res.status(200).send(req.body[0]);

       }
    )
    
}