(function(){

	angular.module("TestProj")
	.controller('NavigationController',['$scope','$state','$http',function($scope,$state,$http){

		if(localStorage['User-Data']){
			$scope.loggedIn = true;
		}else{

			$scope.loggedIn = false;
		}



		$scope.logUserIn = function(){
			console.log("Login Scope : " + $scope.login)
			$http.post('/api/user/login',$scope.login).success(function(response){

				localStorage.setItem('User-Data',JSON.stringify(response));
				$scope.loggedIn = true;
				//localStorage.setItem('User-Data', response);
			}).error(function(err){

				console.log("Error in LOGIN" + err)
			})
		}
	}])

}());