var app = angular.module("HousingApp");

app.controller('SearchPropertyController',function($scope,$http,$filter,$location,$window,PassId,AuthenticationService,$compile,$q,$mdDialog) {

    $scope.busy = true;
    $scope.noMoreData = false;
    $scope.AuthenticationService = AuthenticationService;

    $scope.$parent.seo = { 
    pageTitle : 'Buy Rent Property | Flats | Houses', 
    pageDescripton: 'Buy Rent property | Flats | Houses in Raigad | Khopoli Panvel Alibag Pen Pali' 
    }; 
    
    $scope.Update = function(id){
        console.log("inside edit");
          PassId.setId(id);
          $location.path("/editproperty");      
      }
    $scope.showConfirm = function(ev,id) {
    // Appending dialog to document.body to cover sidenav in docs app
    console.log("Inside delete");
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this property?')
          .textContent('The property once deleted can\'t be restored')
          .ariaLabel('Delete')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');
      $mdDialog.show(confirm).then(function() {
      $scope.Delete(id);
    }, function() {
      //$scope.status = 'You decided to keep your debt.';
    });
  }

  //var prop;
     $scope.all = function(){
        
          $scope.SearchProp = "";
          if($scope.Refine)
          {
            $scope.Refine.Min = "";
            $scope.Refine.Max = "";
          }
          //$scope.WantTo = "Buy";
          //$scope.Rent = "";
          $scope.Type = "";
          $http.get('api/allproperties/' + $scope.WantTo)
            .success(function(response) {
              $scope.properties=response;
              if($scope.properties.length < 20)
              {
                $scope.noMoreData = true;
              }
              $scope.busy = false;
              //prop = response;
              
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
          }

      $scope.SearchProperty = function(){
          //console.log($scope.location);
          if($scope.SearchProp)
          {
            $http.get('api/properties/'  + $scope.SearchProp)
              .success(function(response) {
                $scope.properties=response;
                //prop = response;
                console.log(response);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });
          }
      }

      $scope.RefineProperty = function(){
          var multiple = 1;
          var url = "api/refineproperties/";
          if($scope.SearchProp)
          {
             url += $scope.SearchProp + "/";
          }
          else{
            url += "SP/";
          }
          
          if($scope.WantTo == "Buy")
          {
             url += $scope.WantTo + "/";
             multiple = 100000;
          }
          else if($scope.WantTo == "Rent")
          {
             url += $scope.WantTo + "/";
             multiple = 1000;
          }
          else{
            url += "B/";
          }
          if($scope.Refine && $scope.Refine.Min)
          {
             url += $scope.Refine.Min * multiple + "/";
          }
          else{
            url += "0/";
          }
          if($scope.Refine && $scope.Refine.Max)
          {
             url += $scope.Refine.Max * multiple + "/";
          }
          else{
            url += "100000000/";
          }
          if($scope.Type)
          {
             url += $scope.Type;
          }
          else{
            url += "T";
          }
          console.log(url);
          $http.get(url) 
            .success(function(response) {
              $scope.properties=response;
              if($scope.properties.length < 20)
              {
                $scope.noMoreData = true;
              }
              $scope.busy = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      }

      $scope.PurposeChange = function(purpose){
        if(purpose == "Buy")
        {
          $scope.Rent = "";
        }
        else
          $scope.Buy = "";
        //$scope.properties = $filter('filter')(prop, {"Purpose": purpose});
      }




      $scope.OpenInDetais = function(PropId){
         
         //localStorage.setItem('PropId',PropId);
         var path = $location.absUrl();
         var url=path.split('/')[0]+"/"+path.split('/')[1]+"/"+path.split('/')[2]+"/PropertyDetails?PID="+PropId+"qazxsw";
         $window.open(url, '_blank');
     }

      $scope.Delete = function(id){
        console.log(id);
        $http.delete('/api/properties/' + id)
        .success(function(response){
          console.log("Success");
          $scope.all();
        })

     }

      $scope.myPagingFunction = function(){
        
       if($scope.busy){
        return;
      }
      $scope.busy = true;
      var lastId = $scope.properties[$scope.properties.length-1].Created;
      var multiple = 1;
        var url = "api/filterproperties/";
          if($scope.SearchProp)
          {
             url += $scope.SearchProp + "/";
          }
          else{
            url += "SP/";
          }         
          if($scope.WantTo == "Buy")
          {
             url += $scope.WantTo + "/";
             multiple = 100000;
          }
          else if($scope.WantTo == "Rent")
          {
             url += $scope.WantTo + "/";
             multiple = 1000;
          }
          else{
            url += "B/";
          }
          if($scope.Refine && $scope.Refine.Min)
          {
             url += $scope.Refine.Min * multiple + "/";
          }
          else{
            url += "0/";
          }
          if($scope.Refine && $scope.Refine.Max)
          {
             url += $scope.Refine.Max * multiple + "/";
          }
          else{
            url += "100000000/";
          }
           if($scope.Type)
          {
             url += $scope.Type + "/";
          }
          else{
            url += "T/";
          }
          url += lastId;
      console.log(url);
      $http.get(url).success(function(properties_) {
        console.log(properties_.length);
        $scope.properties = $scope.properties.concat(properties_);
        $scope.busy = false;
        if(properties_.length === 0){
          $scope.noMoreData = true;
        }
      });

     }

      //$scope.all();


       $scope.oepnModalPopUp = function (pathArr) {

              var myHTML;

              myHTML = '<div id="myCarousel" class="carousel slide" data-ride="carousel"> <div class="carousel-inner" role="listbox"><div class="item active"><img src="'+pathArr[0].src+'" alt="Image not found" width="460" height="345"/><div class="carousel-caption"><h3></h3></div></div>'
              for (var i = 0; i < pathArr.length; i++) {

                  myHTML += '<div class="item"><img src="' + pathArr[i].src + '" alt="Flower" width="460" height="345"><div class="carousel-caption"><h3></h3></div></div>'

              }
              myHTML += ' <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href="#myCarousel" role="button" data-slide="next"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>';
              //console.log(myHTML);
              $("#MyDiv").append(myHTML);
              var compiled = $compile(myHTML)($scope);
              $("#MyDiv").html(compiled);
          }

          
          $scope.removeslider = function () { 
            $("#myCarousel").remove(); 
          }

  
   
    $scope.hoverRating1 = 0;
  


    $scope.getAllShortlists = function(){
      var temp = 0;
      
         
        $http.get('/api/getShortlists/' + AuthenticationService.email)
        .success(function (data){

         //console.log(data);
         //temp = data.data;
         $scope.shortlist = data;
           //defer.resolve(temp);          
        });
      //console.log(data);
      //return defer.promise;
    }
    $scope.getAllShortlists();

    $scope.getShortlists = function(propertyId){
      //$scope.show();
      var flag = $filter('filter')($scope.shortlist,{'PropertyId':propertyId});
        if(flag && flag.length >=1)
          return 1;
        else
          return 0;

      };
      
    $scope.go = function()
      {
        $location.path("/sellrentProperty");
      }

/*   
     /$scope.getShortlists(propertyId).then(function(newdata){ return newdata; });
  */  

    $scope.click1 = function (param,propertyId) {

      
         var shortlist = { "shortlist":param,
          "email":AuthenticationService.email,
          "propertyId":propertyId};
        $http.post('/api/addShortlist', shortlist).success(function(result){
          console.log(result);
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

app.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    }
  }
]);

app.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
            "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \
                    <img ng-src='{{((hoverValue + _rating) <= $index) && \"img/star-empty-lg.png\" || \"img/star-fill-lg.png\"}}' \
                    ng-Click='isolatedClick($index + 1)' \
                    ng-mouseenter='isolatedMouseHover($index + 1)' \
                    ng-mouseleave='isolatedMouseLeave($index + 1)'></img> \
            </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;
      
      $scope.isolatedClick = function (param) {
        if ($scope.readOnly == 'true') return;
        
        if($scope.rating==0)
        {
          $scope._rating = 1;
        }
        else
        {
          $scope._rating = 0;
        }
        
        $scope.rating = $scope._rating;
        $scope.hoverValue=0;

        
        $scope.click({
          param: $scope.rating ,

        });
      };

      $scope.isolatedMouseHover = function (param) {
      
        if ($scope.readOnly == 'true') return;
     
        if($scope._rating==1)
        {
          $scope.hoverValue = 0;
        }
        else
          $scope.hoverValue = 1;
        
        
        $scope._rating = 0;
  
        $scope.mouseHover({
          param: param
        });
      };

      $scope.isolatedMouseLeave = function (param) {
        if ($scope.readOnly == 'true') return;
        
       if($scope.rating==1)
        {
          $scope._rating = 1;
        }
        else
        {
          $scope._rating = 0;
        }
        
        $scope.hoverValue = 0;

        $scope.mouseLeave({
          param: param
        });
      };
        }
    };
});

