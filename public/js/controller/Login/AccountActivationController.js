(function(){

	angular.module('HousingApp')
	.controller('AccountActivationController',['$scope','$routeParams','$http',function($scope,$routeParams,$http){
var userId = $routeParams.userid;
if( userId.charAt( 0 ) === ':' )
    userId = userId.slice( 1 );

		$http.put('/api/accountactivation/'+userId).success(function(response){
			console.log(response);
			if(response)
				$scope.message =  "Your account is activated. Thank you for your interest in Raigad Housing. Enjoy!!!";
		})
		
		
	}])
}());