(function(){
	angular.module('SearchPropertyController',['ui.router','ngFileUpload'])
		.config(function($stateProvider){

			$stateProvider
			.state('signUp',{
				url:"/signup",
				templateUrl:"app/signup/signup.html",
				controller:"SignupController"

			})

			.state('editProfile',{
				url:"/edit-profile",
				templateUrl:"app/profile/edit-profile-view.html",
				controller:"EditProfileController"
			})

		});


}());