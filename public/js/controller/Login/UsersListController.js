(function(){

	angular.module('HousingApp')
	.controller('UsersListController',['$scope','$http',function($scope,$http){

		$scope.all = function(){
			$http.get("/api/getUsersList").success(function(response){
				$scope.usersList = response;
			});
		}

		$scope.Delete = function(id){
			$http.delete("/api/deleteUser/"+id)
			    .success(function(response){
          			$scope.all();
        		})
		}

		$scope.all();

	}])

	
}());