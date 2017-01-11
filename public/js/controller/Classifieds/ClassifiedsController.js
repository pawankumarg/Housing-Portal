var app = angular.module("HousingApp");

app.controller('ClassifiedsController',function($scope,$http,$filter,$location,$window,PassId,AuthenticationService,$compile,$q) {

    $scope.busy = true;
    $scope.noMoreData = false;
    $scope.AuthenticationService = AuthenticationService;

    $scope.$parent.seo = { 
    pageTitle : 'Classifieds in Khopoli, Lowjee, Alibag, Pen, Pali, Panvel', 
    pageDescripton: 'easeHousing provides simple online solution for selling your old stuffs. easeHousing offers free classifieds ads in Khopoli, Lowjee, Alibag, Pen, Pali, Panvel' 
    }; 

  //var prop;
    $scope.all = function(){
        
          $http.get('api/allclassifieds')
            .success(function(response) {
              $scope.classifieds=response;
              if($scope.classifieds.length < 20)
              {
                $scope.noMoreData = true;
              }
              $scope.busy = false;
              $scope.products = "";
              $scope.Category = "";
              
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
          }



      $scope.SearchClassifieds = function(){
          var multiple = 1;
          var url = "api/refineads/";
          if($scope.products)
          {
             url += $scope.products + "/";
          }
          else{
            url += "SP/";
          }
          
         
          if($scope.Category)
          {
             url += $scope.Category;
          }
          else{
            url += "C";
          }
          console.log(url);
          $http.get(url) 
            .success(function(response) {
              $scope.classifieds=response;
              //prop = response;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      }

     
      $scope.go = function()
      {
        $location.path("/addClassifieds");
      }

      $scope.Update = function(id){
          PassId.setId(id);
          $location.path("/editClassifieds");      
      }

     $scope.OpenInDetais = function(PropId){
         
         localStorage.setItem('PropId',PropId);
         var path = $location.absUrl();
         var url=path.split('/')[0]+"/"+path.split('/')[1]+"/"+path.split('/')[2]+"/PropertyDetails";
         $window.open(url, '_blank');
     }

      $scope.Delete = function(id){
        
        $http.delete('/api/DeleteAd/' + id)
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
     

     }

      $scope.all();


       $scope.oepnModalPopUp = function (pathArr) {
         
              var myHTML;

              myHTML = '<div id="myCarousel" class="carousel slide" data-ride="carousel"> <div class="carousel-inner" role="listbox"><div class="item active"><img src="'+pathArr[0].src+'" alt="Image not found" width="460" height="345"/><div class="carousel-caption"></div></div>'
              for (var i = 0; i < pathArr.length; i++) {

                  myHTML += '<div class="item"><img src="' + pathArr[i].src + '" alt="Flower" width="460" height="345"><div class="carousel-caption"></div></div>'

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

  
   
    });



