(function(){

	angular.module('HousingApp')
	.controller('BeamemberController',['$scope','$http',function($scope,$http){
        $scope.ShowForm = true;
		$scope.ShowMessage = false;
		$scope.$parent.seo = { 
          pageTitle : 'Be a Member of easeHousing', 
          pageDescripton: 'Earn by being a member of easeHousing by telling us your skills. Tell us if you can Repair appliances or are a Beautician. Currently serving only in Khopoli' 
        }; 

        $scope.FinalSubmit = function()
        {
        	$http.post('/api/submitMember',$scope.formData).success(function(member){
        		console.log(member);

        		if(member)
        		{
        			$scope.formData = [];  
                    $scope.ShowForm = false;      			
        			$scope.ShowMessage = true;
        			$scope.message = "Thank you for contacting easeHousing. Your message has been submitted and we will get back to you shortly";
        		}
                console.log(member.Skills);
        	})
        	.error(function(err){
        		$scope.message = "We are having some trouble saving your form. Sorry for the inconvenience caused.";
        	});
        }

	}])

	
}());