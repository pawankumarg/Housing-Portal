(function(){

	angular.module('HousingApp')
	.controller('ContactusController',['$scope','$http',function($scope,$http){

		$scope.ShowForm = true;
		$scope.ShowMessage = false;
		$scope.$parent.seo = { 
          pageTitle : 'Contact Us', 
          pageDescripton: 'Contact easeHousing to sell rent properties, flats, apartments or if you are beauty specialist' 
        }; 

        $scope.FinalSubmit = function()
        {
        	$http.post('/api/submitContact',$scope.formData).success(function(contact){
        		console.log(contact);
        		if(contact)
        		{
        			$scope.formData = [];
        			$scope.ShowForm = false;
        			$scope.ShowMessage = true;
        			$scope.message = "Thank you for contacting easeHousing. Your message has been submitted and we will get back to you shortly";
        		}
        	})
        	.error(function(err){
        		$scope.message = "We are having some trouble saving your form. Sorry for the inconvenience caused.";
        	});
        }

	}])

    .controller('GetContactusController',['$scope','$http',function($scope,$http){
        $scope.getContactUs = function(){
            $http.get("/api/getContactUs").success(function(contacts){
                $scope.contacts = contacts;
            })
        }

        $scope.Delete = function(id){
            $http.delete('/api/deleteContact/' + id).success(function(contact){
                $scope.getContactUs();
        })
        }
        $scope.getContactUs();
    

    }])

	
}());