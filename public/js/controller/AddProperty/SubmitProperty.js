var app = angular.module("HousingApp");
     app.controller('SellRentPropertyController', ['Upload', '$scope', '$http', '$location', 'AuthenticationService', '$compile', function (Upload, $scope, $http, $location, AuthenticationService, $compile) {

        $scope.$parent.seo = { 
        pageTitle : 'Sell Rent Property | Flats | Houses', 
        pageDescripton: 'Add details to Sell Rent property | Flats | Houses in Raigad | Khopoli Panvel Alibag Pen Pali' 
        };
         
         $scope.formData={};
         
        $scope.getLocation = function(){
            var mapAddress=""
            
            if($scope.formData.Address !=undefined && $scope.formData.Address != ""){
                mapAddress=$scope.formData.Address;
            }
            if($scope.formData.Location !=undefined && $scope.formData.Location != ""){
                 mapAddress+= ","+$scope.formData.Location;
            }
            if($scope.formData.City !=undefined && $scope.formData.City != ""){
                mapAddress+=" "+$scope.formData.City;
            }
            
            
            geocoder = new google.maps.Geocoder();
            
            geocoder.geocode({
                address: mapAddress
              }, function (result, status) {
                  if (status === google.maps.GeocoderStatus.OK) {
                      $scope.formData.Latitude = result[0].geometry.location.lat();
                      $scope.formData.Logitude = result[0].geometry.location.lng();
                      $scope.formData.MapLocationAddress = result[0].formatted_address;
//                      alert("Location: " + result[0].formatted_address + "\r\nLatitude: " + result[0].geometry.location.lat() +                                    "\r\nLongitude: " + result[0].geometry.location.lng());
                  }else{
                      alert("Unable to find location.Please, enter valid address")
                  }
              });
       
            
        } 
          

     
         
          /* var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(18.9300, 72.8200),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var marker = new google.maps.Marker({
        map: $scope.map,
        position: new google.maps.LatLng(18.6500, 72.8800),
        title: "Set Location", options: { draggable: false }
    });


    google.maps.event.addListener($scope.map, 'click', function (e) {
        marker.setMap(null);
        latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
        var geocoder = geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    alert("Location: " + results[1].formatted_address + "\r\nLatitude: " + e.latLng.lat() + "\r\nLongitude: " + e.latLng.lng());
                   
                    $scope.formData.Latitude = e.latLng.lat();
                     $scope.formData.Logitude = e.latLng.lng();
                    $scope.formData.MapLocationAddress = results[1].formatted_address;
                    //latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                }
            }
        });
        marker = new google.maps.Marker({
            position: latlng,
            map: $scope.map,
            title: "", options: { draggable: true }
        });
    });*/

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
                     $scope.ImgArr = TempUploadImgArr;
                     $scope.formData.arrToUpload = TempUploadImgArr;

                 }).error(function (err) {
                     console.log(err);
                 })
             }

         }
         
         $scope.FinalSubmit = function(){
           if($scope.formData.Purpose=="Rent")
           {
            $scope.formData.BuiltupArea =1;
           }
             $http({
                   url: 'api/FinalSellRentSubmit',
                     method: 'POST',
                     data: $scope.formData //.ImgArr,
                     //file: $scope.formData
              }).
              success( function(response) {
                 console.log("success");
                 $location.path("searchproperty");
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