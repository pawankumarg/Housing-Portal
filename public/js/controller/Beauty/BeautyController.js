var app = angular.module("HousingApp");

app.controller('BeautyController',function($scope,$http,$filter,$location,$window,PassId,AuthenticationService) {
  $scope.$parent.seo = { 
          pageTitle : 'Beauty', 
          pageDescripton: 'Online book Beauty Specialist' 
        }; 
  $scope.ShowAddress = false;
  $scope.Showbeauty = true;
  $scope.ShowMessage = false;
  $scope.formData = {};
  var now = new Date();
  now.setDate(now.getDate()+1)
  $scope.formData.appointmentDate = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes());

  $scope.submitbeauty = function(){
    $scope.ShowAddress = true;
    $scope.Showbeauty = false;
    $scope.ShowMessage = false;
  }

  $scope.submitReport = function(){
    console.log($scope.formData);

    $http.post("/api/bookBeautyAppointment" ,$scope.formData).success(function(result){
      $scope.ReportID = result._id;
      console.log(result);
    })
    .error(function(err){
      console.log(err);
    })

    $scope.ShowAddress = false;
    $scope.Showbeauty = false;
    $scope.ShowMessage = true;
  }
});
