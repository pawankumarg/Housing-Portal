(function(){

	angular.module('TestProj')
	.controller('EditProfileController',['Upload','$scope','$state','$http',function(Upload, $scope , $state , $http){

		$scope.user = JSON.parse(localStorage['User-Data']) || undefined ;

		/*$scope.$watch(function(){
			return $scope.file
		},function(){
			$scope.upload($scope.file);
		});


		$scope.upload = function (file){
			if(file){
				Upload.upload({
					url:'api/profile/edit',
					method : 'POST',
					data : {userId : $scope.user._id},
					file : file
				}).progress(function(){
					console.log("Is in progress...")
				}).success(function(data){
					console.log("File uploading successful....");
				}).error(function(err){
					console.log(err);
				})
			}
		};*/

		$scope.$watch(function(){
			return $scope.files
		},function(){
			$scope.uploadFiles($scope.files);
		});

		  $scope.uploadFiles = function (files) {
      	/*if (files && files.length) {
        	for (var i = 0; i < files.length; i++) {
			Upload.upload({..., data: {file: files[i]}, ...})...;
        }*/
        // or send them all together for HTML5 browsers:
        //Upload.upload({..., data: {file: files}, ...})...;
        if(files){
        	Upload.upload({
					url:'api/profile/edit',
					method : 'POST',
					data : {userId : $scope.user._id},
					file : files
				}).progress(function(){
					console.log("Is in progress...")
				}).success(function(data){
					console.log("File uploading successful....");
				}).error(function(err){
					console.log(err);
				})
			}

      }
    



	}]);//function inside controller end



}());