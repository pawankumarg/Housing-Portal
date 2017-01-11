var app = angular.module("HousingApp",['ngRoute','ngFileUpload','infinite-scroll','ngMaterial', 'ngMessages']);
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});
app.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
    $routeProvider.
     when('/', {
        templateUrl: 'pages/main.html',
        controller: 'HousingController',
        access: { requiredLogin: false }
      })
        .when('/sellrentProperty', {
        templateUrl: 'pages/sellrentproperty.html',
        controller: 'SellRentPropertyController',
        access: { requiredLogin: true }
      })
        .when('/editproperty', {
        templateUrl: 'pages/editproperty.html',
        controller: 'EditPropertyController',
        access: { requiredLogin: true }
      })
        .when('/searchproperty', {
        templateUrl: 'pages/searchproperty.html',
        controller: 'SearchPropertyController',
        access: { requiredLogin: false }
      })
        .when('/shortlistproperty', {
        templateUrl: 'pages/shortlistproperty.html',
        controller: 'ShortlistController',
        access: { requiredLogin: true }
      })
    .when('/PropertyDetails', {
        templateUrl: '/Modules/PropertyDetails/PropertyDetails.html',
        controller: 'PropertyDetailslController',
        access: { requiredLogin: false }
      })
        .when('/userslist', {
        templateUrl: 'pages/userslist.html',
        controller: 'UsersListController',
        access: { requiredLogin: false }
      })
      .when('/userprofile', {
        templateUrl: 'pages/userprofile.html',
        controller: 'UserProfileController',
        access: { requiredLogin: false }
      })
      .when('/contactus', {
        templateUrl: 'pages/contactus.html',
        controller: 'ContactusController',
        access: { requiredLogin: false }
      })
      .when('/beamember', {
        templateUrl: 'pages/beamember.html',
        controller: 'BeamemberController',
        access: { requiredLogin: false }
      })
      .when('/repair', {
        templateUrl: 'pages/repairing.html',
        controller: 'RepairingController',
        access: { requiredLogin: false }
      })
        .when('/classifieds', {
        templateUrl: 'pages/classifieds.html',
        controller: 'ClassifiedsController',
        access: { requiredLogin: false }
      })
      .when('/addClassifieds', {
        templateUrl: 'pages/addClassifieds.html',
        controller: 'AddClassifiedsController',
        access: { requiredLogin: false }
      })
      .when('/editClassifieds', {
        templateUrl: 'pages/editClassifieds.html',
        controller: 'EditClassifiedsController',
        access: { requiredLogin: false }
      })
      .when('/beauty', {
        templateUrl: 'pages/beauty.html',
        controller: 'BeautyController',
        access: { requiredLogin: false }
      })
      .when('/fitness', {
        templateUrl: 'pages/fitness.html',
        controller: 'FitnessController',
        access: { requiredLogin: false }
      }) 
      .when('/signup', {
        templateUrl: 'pages/signup.html',
        controller: 'SignupController',
        access: { requiredLogin: false }
      })
      .when('/editProfile', {
        templateUrl: 'pages/editProfile.html',
        controller: 'EditProfileController',
        access: { requiredLogin: true }
      })
       .when('/accountactivation:userid', {
        templateUrl: 'pages/accountactivation.html',
        controller: 'AccountActivationController',
        access: { requiredLogin: false }
      })
      .when('/AllContactUs', {
        templateUrl: 'pages/getContactUs.html',
        controller: 'GetContactusController',
        access: { requiredLogin: true }
      })
      .when('/sendpromosms', {
        templateUrl: 'pages/sendpromosms.html',
        controller: 'SendPromoSMS',
        access: { requiredLogin: true }
      })
$locationProvider.html5Mode(true);
$locationProvider.hashPrefix('!');
  }]);



// create the controller and inject Angular's $scope
    app.controller('HousingController', function($scope,$http) {
        $scope.$parent.seo = { 
          pageTitle : 'All your Housing needs at one place', 
          pageDescripton: 'Search Rent property, Repair, Beauty' 
        }; 
         $http.get('/api/propertyCount').success(function(propertyCount){         
          $scope.propertyCount = propertyCount;
            console.log(propertyCount);
        })
         $http.get('/api/appliancesCount').success(function(appliancesCount){
          $scope.appliancesCount = appliancesCount;
        })
        $http.get('/api/beautyCount').success(function(beautyCount){
          $scope.beautyCount = beautyCount;
        })
        $http.get('/api/adsCount').success(function(adsCount){          
          $scope.adsCount = adsCount;
        });
        
    });

     app.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  });

     app.controller('NavigationController', ['$scope', '$location', '$window','$http','UserService', 'AuthenticationService','$mdSidenav', '$log','$timeout',
    function ($scope, $location, $window, $http,UserService, AuthenticationService, $mdSidenav, $log,$timeout) {
        
        //$scope.preaLoader=false;
        
        //$timeout(callAtTimeout, 3000);

    function callAtTimeout() {
         //alert("Btn clicked");
       
        //$scope.preaLoader=false;

    }
       
        $scope.AuthenticationService = AuthenticationService;
        $scope.facebookOauthUrl = '/login/facebook';
        $scope.login = [];
        $scope.getSocialId = function(){
          $http.get('/api/getSocialId').success(function(user){
            
            if(user)
            {            
                AuthenticationService.isLogged = true;
                AuthenticationService.email = user.email;
                AuthenticationService.isAdmin = user.isAdmin==1 ? true : false;
                $window.sessionStorage.token = user.email;
                $scope.user = user;
            }
            else
            {
                //$scope.invalid = true;
                 AuthenticationService.isLogged = false;
                 AuthenticationService.email = "";
                 AuthenticationService.isAdmin = false;
                delete $window.sessionStorage.token;

            }
          })
        }


        $scope.getSocialId();
        

        $scope.logUserIn = function () {
            if ($scope.login != null && $scope.login.email != undefined && $scope.login.password != undefined) {
              
                UserService.logIn($scope.login.email, $scope.login.password).success(function(data) {
                  
                  console.log(data);
                   //console.log(res.user);
                    if(data.email)
                    {
                      $scope.dismiss();
                      $scope.invalid = false;
                      //$scope.login.email = data.email;
                      AuthenticationService.isLogged = true;
                      AuthenticationService.email = data.email;
                      AuthenticationService.isAdmin = data.isAdmin==1 ? true : false;
                      //console.log(AuthenticationService.isAdmin);
                      $window.sessionStorage.token = data.email;
                      //$scope.loggedIn = true;
                    }
                    else
                    {
                        $scope.invalid = true;
                         AuthenticationService.isLogged = false;
                         AuthenticationService.email = "";
                         AuthenticationService.isAdmin = false;
                        delete $window.sessionStorage.token;

                    }
                    $scope.login.password="";
                   
                }).error(function(status, data) {
                    console.log("Error in LOGIN" + err)
                });
            }
        }
 
        $scope.logout = function logout() {
          $http.get("/api/logout").success(function(result){
            if (AuthenticationService.isLogged) {
                AuthenticationService.isLogged = false;
                AuthenticationService.email = "";
                delete $window.sessionStorage.token;
                $location.path("/");
            }
          })
            
        }

       $scope.SocialLogin = function(socialNetwork){
          $scope.dismiss();
           var data = {};
          data.redirectURL = $location.path();
          $http.post('/api/setURL',data).success(function(result){
              $window.location = "/login/"+socialNetwork;
          })
       }

        $scope.Redirect = function(){
          
          $location.path("/signup");
          $scope.dismiss();
        }

        $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }

        
    }
]);


    /*app.controller('SellRentPropertyController',['Upload','$scope','$http','$location','AuthenticationService',function(Upload, $scope , $http,$location,AuthenticationService){
        $scope.submitProperty = function(){
                if ($scope.formData.files) {
                    $scope.uploadFiles($scope.formData.files);
                  }
        }          

        $scope.uploadFiles = function (files) {
        $scope.formData.Email = AuthenticationService.email;
        if(files){
          Upload.upload({
          url:'api/properties',
          method : 'POST',
          data : $scope.formData,
          file : files
        }).progress(function(){
          console.log("Is in progress...")
        }).success(function(data){
          //console.log("File uploading successful....");
           $location.path("/searchproperty"); 
                
        }).error(function(err){
          console.log(err);
        })
      }

      }

  }]);
*/
    
     
     app.controller('PlumbingController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look..!';
    });

    app.controller('ElectricalController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });
        app.controller('CarpentryController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look..!';
    });

    app.controller('PestcontrolController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

     app.controller('HomecleaningController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look..!';
    });

    app.controller('LaundryController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });
    app.controller('LaptoprepairController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look..!';
    });

    app.controller('MobilerepairController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

     app.controller('BeautyController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look..!';
    });

    app.controller('FitnessController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

    app.run(function($rootScope, $location,$window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

      if(nextRoute != null && nextRoute.access != null && nextRoute.access.requiredLogin && !AuthenticationService.isLogged && !$window.sessionStorage.token)
      {
        // redirect the user to the login screen
        $location.path("/");
      }
      // this path will be reached if either the next route requires no login,
      // or the user isAuthenticated or the user has a token
      else
      {
      // treat the case were there is a token, but the user is not actually authenticated
      // i.e. after pressing F5
      if( $window.sessionStorage.token && !AuthenticationService.isLogged )
      {
      // login the user
        AuthenticationService.isLogged = true;
        AuthenticationService.email = $window.sessionStorage.token;
      }
      }

      });
    });

    app.directive('myModal', function() {
   return {
     restrict: 'A',
     link: function(scope, element, attr) {
       scope.dismiss = function() {
           element.modal('hide');
       };
       scope.show = function() {
           element.modal('show');
       };
     }
   } 
});