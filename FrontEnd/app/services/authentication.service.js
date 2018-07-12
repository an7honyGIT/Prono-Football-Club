 
    angular
        .module('pfcApp')
        .factory('AuthenticationService', AuthenticationService);
 
    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService', 'API_BASE_URL'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService,API_BASE_URL) {
        var service = {};
 
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
 
        return service;
 
        function Login(username, password) {
 
            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            /*$timeout(function () {
                var response;
                if (username !== null && password === 'password') {
                    response = { token:'123'};
                } else {
                    response = { message: 'Username or password is incorrect' };
                }
                callback(response);
            }, 1000);*/
 
            /* Use this for real authentication
             ----------------------------------------------*/
            return $http.post(API_BASE_URL+'/users/token', { username: username, password: password });
        }
 
        function SetCredentials(token) {
             
            $rootScope.globals = {
                currentUser: {
                    token: token
                }
            };
 
            // set default auth header for http requests
            $http.defaults.headers.common['apiKey'] = token;
 
            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }
 
        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.apiKey ='';
        }
    }
 