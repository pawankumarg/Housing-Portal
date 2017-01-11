var app = angular.module("HousingApp");

   app.controller('AddClassifiedsController', ['Upload', '$scope', '$http', '$location', 'AuthenticationService', '$compile', function (Upload, $scope, $http, $location, AuthenticationService, $compile) {

     $scope.$parent.seo = { 
    pageTitle : 'Add a free Ad in Khopoli, Lowjee, Alibag, Pen, Pali, Panvel', 
    pageDescripton: 'easeHousing provides simple online solution for selling your old stuffs. easeHousing offers free classifieds ads in Khopoli, Lowjee, Alibag, Pen, Pali, Panvel' 
    }; 
        $scope.formData= {}; 
         $scope.$watch(function () {
             return $scope.files
         }, function () {

             if ($scope.files != undefined) {

                 uploadFiles($scope.files);

             }
         });

         function uploadFiles(files) {
             //$scope.formData.Email = AuthenticationService.email;
             if (files) {
                 Upload.upload({
                     url: 'api/properties',
                     method: 'POST',
                     data: $scope.formData,
                     file: files
                 }).progress(function () {
                     console.log("Is in progress...")
                 }).success(function (tempImageData) {
                     console.log(tempImageData)


                     var TempUploadImgArr = [];
                     var imgGallaryHtml = "";
                     for (var i = 0; i < tempImageData.ImagePath.length; i++) {
                         TempUploadImgArr.push({
                             Id: tempImageData._id,
                             src: tempImageData.ImagePath[i].src
                         });

                         var ttt = tempImageData.ImagePath[i].src;
                         var nnn = ttt.replace(/'/g, "\\'");
                         
                    imgGallaryHtml +='<div><a href="'+tempImageData.ImagePath[i].src+'" data-lightbox="gallary"><img src="'+tempImageData.ImagePath[i].src+'"  /></a><span style="float: left;margin-left: -69px;margin-top: -10px;" class="glyphicon glyphicon-remove" ng-click="DeleteImg(' + JSON.stringify(ttt).replace(/"/g, '&quot;') + ')"></span></div>'
                                          
                     }
                     console.log(imgGallaryHtml);
                     var compiled = $compile(imgGallaryHtml)($scope);
                     $("#GallaryDiv").html(compiled);
                     console.log(TempUploadImgArr);

                     $scope.ImgArr = TempUploadImgArr;
                     $scope.formData.arrToUpload = TempUploadImgArr;

                 }).error(function (err) {
                     console.log(err);
                 })
             }

         }
         
         $scope.FinalSubmit = function(){
           
             $http({
                   url: 'api/FinalAdsSubmit',
                     method: 'POST',
                     data: $scope.formData //.ImgArr,
                     //file: $scope.formData
              }).
              success( function(response) {
                 console.log("success");
                 $location.path("classifieds");
              }).
              error( function(response) {
                  console.log("error");
              });
         }
         
         $scope.DeleteImg = function (ImgToDelete) {

             console.log(ImgToDelete);
             var ArrToUpdateSrc = new Array();
             var ArrToUpdate = new Array();
             for (var j = 0; j < $scope.ImgArr.length; j++) {

                 if ($scope.ImgArr[j].src != ImgToDelete) {
                     ArrToUpdateSrc.push({
                         src: $scope.ImgArr[j].src
                     })
                 }
             }
             ArrToUpdate.push({
                 Id: $scope.ImgArr[0].Id,
                 AllSrc: ArrToUpdateSrc
             });
             $scope.UpdateImgArray = ArrToUpdate
             $http.post('api/UpdateTempImgData', $scope.UpdateImgArray)
                 .success(function (rtnDelImgArr, status) {
                     if (status == 200) {
                         console.log("jst success " + status + " and new array is " + rtnDelImgArr);

                         if (rtnDelImgArr.AllSrc.length > 0) {
                             var TempUploadImgArr = [];
                             var imgGallaryHtml = "";
                             for (var i = 0; i < rtnDelImgArr.AllSrc.length; i++) {
                                 TempUploadImgArr.push({
                                     Id: rtnDelImgArr.Id,
                                     src: rtnDelImgArr.AllSrc[i].src
                                 });

                                 var imgSrc = rtnDelImgArr.AllSrc[i].src;
                               
                                 imgGallaryHtml +='<div><a href="'+imgSrc+'" data-lightbox="gallary"><img src="'+imgSrc+'"  /></a><span style="float: left;margin-left: -69px;margin-top: -10px;" class="glyphicon glyphicon-remove" ng-click="DeleteImg(' + JSON.stringify(imgSrc).replace(/"/g, '&quot;') + ')"></span></div>';

                                 //                  
                             }
                             console.log(imgGallaryHtml);
                             var compiled = $compile(imgGallaryHtml)($scope);
                             $("#GallaryDiv").html(compiled);
                             $scope.ImgArr = TempUploadImgArr;
                             $scope.formData.arrToUpload = TempUploadImgArr;
                         } else {
                             $("#GallaryDiv").html("");

                         }
                     }
                 })
             }
         

     
    }]);

