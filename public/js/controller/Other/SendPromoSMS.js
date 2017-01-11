(function(){

	angular.module('HousingApp')
	.controller('SendPromoSMS',['$scope','$http',function($scope,$http){
		
		$scope.ShowMessage = false;
		
        $scope.FinalSubmit = function()
        {
        	$http.post('/api/sendpromosms',$scope.formData).success(function(result){
        		console.log(result);
        		if(result)
        		{
        			//$scope.formData = [];
        			
        			$scope.ShowMessage = true;
        			$scope.message = "SMS sent successfully";
        		}
        	})
        	.error(function(err){
        		$scope.message = "We are having some trouble saving your form. Sorry for the inconvenience caused.";
        	});
        }

	}])


	
}());