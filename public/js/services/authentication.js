var app = angular.module("HousingApp");

app.service('AuthenticationService', function() {
    var auth = {
        isLogged: false,
        email:"",
        isAdmin:false
    }
 
    return auth;
});

app.service('UserService', function($http) {
    return {
        logIn: function(email, password) {
            return $http.post('api/user/login', {email: email, password: password});
        },
 
        logOut: function() {
 
        }
    }
});

app.service('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
 
        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },
 
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/admin/login");
            }
 
            return $q.reject(rejection);
        }
    };
});