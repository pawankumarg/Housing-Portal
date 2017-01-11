var fs = require('fs-extra');
var path = require('path');
var mv = require('mv');
var mongojs = require("mongojs");
var db = mongojs("mongodb://127.0.0.1:27017/test", ["properties","users","TFStorage"]);


module.exports.uploadPhoto = function (req,res){

    var file = req.files.file;
    var targetPathArr = [];
    for (var i = 0; i < file.length; i++) {
        var tempPath = file[i].path;
        console.log("Temp Path "+tempPath)
        console.log("Directory name "+__dirname)
        
        var targetPath = path.join(__dirname ,"../../../img/TempUpload/" + i + file[i].name);
        console.log("Target Path "+targetPath)
        var str = "Image" + i;
        targetPathArr.push({
            src: "/img/TempUpload/" + i + file[i].name
        });

        mv(tempPath, targetPath, function (err) {
            if (err) { throw err; }

        });
    }
    db.TFStorage.insert({
        ImagePath: targetPathArr
    }, function (err, doc) {
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