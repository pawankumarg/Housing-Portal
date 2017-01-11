var app = angular.module("HousingApp");

app.controller('FacebookloginController',function($scope,$http,$filter,$location,$window,PassId,AuthenticationService,$compile) {
	$http.get('/login/facebook',function(res){
			console.log("11");
			$scope.email = res;
		});

});
