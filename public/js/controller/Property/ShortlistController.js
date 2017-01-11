var app = angular.module("HousingApp");

app.controller('ShortlistController',function($scope,$http,$filter,$location,AuthenticationService) {
 $scope.isShow=[];

  $scope.getAllShortlists = function(){        
      $http.get('/api/getShortlists/' + AuthenticationService.email)
        .success(function (data){

           if(data && data.length>0)
           {
              //console.log(data);
             var arr = [];
             $scope.count = data.length;
             for(var i=0;i<data.length;i++)
             {
              console.log(data[i].PropertyId);
              arr.push(data[i].PropertyId);
             }
             //var arr = ["569a4559ba06c39419a7370a","569a4559ba06c39419a7370a","569a4559ba06c39419a7370a","5693f45dfbf45cec1db060d4","569d2190ed6874401985f74d"];
             $http.post('/api/getShortlistedProperty/', arr).success(function(properties){
                $scope.properties = properties;
             })
         }
         else
         {
          $scope.count = 0;
         }
        });
      }

    $scope.getAllShortlists();

    

     $scope.click1 = function (param,propertyId,index) {
         var shortlist = { "shortlist":param,
          "email":AuthenticationService.email,
          "propertyId":propertyId};
          $http.post('/api/addShortlist', shortlist).success(function(result){
            $scope.count = $scope.count - 1;
            $scope.isShow[index] = index;
          })
          .error(function(err){
        })
    };

    $scope.mouseHover1 = function (param) {
        //console.log('mouseHover(' + param + ')');
       
        //$scope.hoverRating1 = param;
    };

    $scope.mouseLeave1 = function (param) {
        //console.log('mouseLeave(' + param + ')');
        //$scope.hoverRating1 = param + '*';
    };

});

