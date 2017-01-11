var app = angular.module("HousingApp");

app.controller('RepairingController',function($scope,$http,$filter,$location,$window,PassId,AuthenticationService) {
  $scope.$parent.seo = { 
          pageTitle : 'Repair', 
          pageDescripton: 'Repair AC, Air Coolers, Desktop, Laptop, Geyser, Microwave Oven, Mobile, Refrigerator, TV, Washing Machine, Water Purifier' 
        }; 
  $scope.ShowAddress = false;
  $scope.ShowRepair = true;
  $scope.ShowMessage = false;
  $scope.formData = {};
  var now = new Date();
  now.setDate(now.getDate()+1)
  $scope.formData.appointmentDate = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes());

  $scope.submitRepairs = function(){
    $scope.ShowAddress = true;
    $scope.ShowRepair = false;
    $scope.ShowMessage = false;
  }
 
  $scope.submitReport = function(){
    console.log($scope.formData);

    $http.post("/api/reportApplianceIssue" ,$scope.formData).success(function(result){
      $scope.ReportID = result._id;
      console.log(result);
    })
    .error(function(err){
      console.log(err);
    })

    $scope.ShowAddress = false;
    $scope.ShowRepair = false;
    $scope.ShowMessage = true;
  }
});
