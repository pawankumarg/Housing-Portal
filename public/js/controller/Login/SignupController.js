(function(){

	angular.module('HousingApp')
	.controller('SignupController',['$scope','$http',function($scope,$http){

		$scope.ShowForm = true;
		$scope.ShowMessage = false;
		

		$scope.createUser=function(){

			console.log($scope.newUser)
			$http.post('api/user/signup',$scope.newUser).success(function(result){
				

				if(result=="Exists")
				{
					$scope.exists = true;
				}
				else
				{
					console.log(result);
					$scope.exists = false;
					$scope.ShowForm = false;
					$scope.ShowMessage = true;					
				}
			}).error(function(err){
				console.log("Error : "+ err)
			})
			
		
		}

	}])
	.directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})
	.directive("passwordStrength", function(){
    return {        
        restrict: 'A',
        link: function(scope, element, attrs){                    
            scope.$watch(attrs.passwordStrength, function(value) {
               
                if(angular.isDefined(value)){
                    if (value.length > 8) {
                        scope.strength = 'Strong';
                    } else if (value.length > 3) {
                        scope.strength = 'Medium';
                    } else {
                        scope.strength = 'Weak';
                    }
                }
            });
        }
    };
});
 



}());


