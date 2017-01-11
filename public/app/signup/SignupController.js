(function(){

	angular.module('TestProj')
	.controller('SignupController',['$scope','$state','$http',function($scope,$state,$http){

		$scope.createUser=function(){

			console.log($scope.newUser)
			$http.post('api/user/signup',$scope.newUser).success(function(result){

				console.log("success");
			}).error(function(err){
				console.log("Error : "+ err)
			})


		}

	}])




}());