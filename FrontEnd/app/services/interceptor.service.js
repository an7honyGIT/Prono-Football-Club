angular
    .module('pfcApp')
    .factory('MyInterceptor', ['$q','$location', function($q,$location){
    	return{
	        'responseError': function(rejection){
	          if (rejection.status === 403) {
	            $location.path('/login');
	            return $q(function () { return null; })
	          }
	          return $q.reject(rejection);
	          }
	      }
    }])
    .config(['$httpProvider', function($httpProvider) {  
	    $httpProvider.interceptors.push('MyInterceptor');
	}]);