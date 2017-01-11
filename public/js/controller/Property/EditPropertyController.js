var app = angular.module("HousingApp");

app.controller('EditPropertyController', function($scope,$http,$filter,$location,$compile,PassId,Upload) {
  var prop;

      $scope.FindOneProperty = function(){
        
          console.log(PassId.getId());
          $http.get('api/getPropertyByID/'  + PassId.getId())
            .success(function(response) {
              console.log(response);
              $scope.formData=response;
             
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      }

         $scope.submitProperty = function(){
        //console.log($scope.Title);
          $http.put('api/updateproperty/' + PassId.getId(), $scope.formData)
            .success(function(response) {
                 $location.path("/searchproperty"); 
               
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }

      $scope.Delete = function(id){
        
        $http.delete('/api/properties/' + id)
        .success(function(response){
          console.log("Success");
          $scope.all();
        })

     }

      $scope.FindOneProperty();

       $scope.$watch(function () {
             return $scope.files
         }, function () {

             if ($scope.files != undefined) {

                 uploadFiles($scope.files);

             }
         });

         function uploadFiles(files) {
             console.log($scope.formData.ImagePath);
             if (files) {
                 Upload.upload({
                     url: 'api/EditPropertyPhoto',
                     method: 'POST',
                     data: $scope.formData,
                     file: files
                 }).progress(function () {
                     console.log("Is in progress...")
                 }).success(function (tempImageData) {
                     console.log(tempImageData)
                     $scope.formData.ImagePath = tempImageData.ImagePath;

                  
                     var imgGallaryHtml = "";

                     for (var i = 0; i < tempImageData.ImagePath.length; i++) {
                      

                         var ttt = tempImageData.ImagePath[i].src;
                         var nnn = ttt.replace(/'/g, "\\'");
                         
                    imgGallaryHtml +='<div><a href="'+tempImageData.ImagePath[i].src+'" data-lightbox="gallary"><img src="'+tempImageData.ImagePath[i].src+'"  /></a><span style="float: left;margin-left: -69px;margin-top: -10px;" class="glyphicon glyphicon-remove" ng-click="DeleteImg(' + JSON.stringify(ttt).replace(/"/g, '&quot;') + ')"></span></div>'
                                          
                     }
                     console.log(imgGallaryHtml);
                     var compiled = $compile(imgGallaryHtml)($scope);
                     $("#GallaryDiv").html(compiled);
                     //console.log(TempUploadImgArr);

                    
                 }).error(function (err) {
                     console.log(err);
                 })
             }

         }

          $scope.DeleteImg = function (ImgToDelete) {
          console.log(ImgToDelete);
          console.log($scope.formData.ImagePath.length);
             var ArrToUpdateSrc = new Array();
             var ArrToUpdate = new Array();
             for (var j = 0; j < $scope.formData.ImagePath.length; j++) {
                var len = $scope.formData.ImagePath[j].src.split("/").length;
                var len1  = ImgToDelete.split("/").length;

                 if ($scope.formData.ImagePath[j].src.split("/")[len-1] == ImgToDelete.split("/")[len1-1]) {
                  console.log("inside if");
                    $scope.formData.ImagePath.splice(j,1);
                 }
             }
                    console.log($scope.formData.ImagePath.length);
                         if ($scope.formData.ImagePath.length > 0) {
                           var imgGallaryHtml="";
                             for (var i = 0; i < $scope.formData.ImagePath.length; i++) {
                                                               
                                 imgGallaryHtml +='<div><a href="'+$scope.formData.ImagePath[i].src+'" data-lightbox="gallary"><img src="'+$scope.formData.ImagePath[i].src+'"  /></a><span style="float: left;margin-left: -69px;margin-top: -10px;" class="glyphicon glyphicon-remove" ng-click="DeleteImg(\'' + $scope.formData.ImagePath[i].src + '\')"></span></div>';

                                                   
                             }
                             console.log(imgGallaryHtml);
                             var compiled = $compile(imgGallaryHtml)($scope);
                             $("#GallaryDiv").html(compiled);
                             //$scope.ImgArr = TempUploadImgArr;
                             //$scope.formData.arrToUpload = TempUploadImgArr;
                         } else {
                             $("#GallaryDiv").html("");

                         }
                     
                
             }

    });

