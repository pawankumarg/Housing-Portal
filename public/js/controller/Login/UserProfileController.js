var app = angular.module('HousingApp')
app.controller('UserProfileController',function($scope,$http,$window,AuthenticationService){
     $http.get('/api/getSocialId').success(function(user){
        console.log(user);
        if(user)
        {            
            AuthenticationService.isLogged = true;
            AuthenticationService.email = user.email;
            $window.sessionStorage.token = user.email;
            $scope.user = user;
        }
     })

	})
	
