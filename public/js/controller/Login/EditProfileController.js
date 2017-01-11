var app = angular.module('HousingApp')
app.controller('EditProfileController',function($scope,$http,AuthenticationService){
        //console.log(AuthenticationService.email);
        //$scope.newUser.email = AuthenticationService.email;

        $http.get('/api/user/getUser/' + AuthenticationService.email).success(function(result){
            if(result && result.length>0)
            {
            	$scope.newUser = result[0];
        	}
        }).error(function(err){
            console.log(err);
        })

        //console.log($scope);
		$scope.updateUser=function(){

			console.log($scope.newUser)
			$http.put('api/user/signup/' + $scope.newUser.email,$scope.newUser).success(function(result){

				console.log("success");
			}).error(function(err){
				console.log("Error : "+ err)
			})


		}

	})
	
