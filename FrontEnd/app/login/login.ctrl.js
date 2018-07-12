
/**
 * @ngdoc function
 * @name pfcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pfcApp
 */
angular.module('pfcApp')
	.controller('LoginController', LoginController);

	LoginController.$inject = ['$location', 'AuthenticationService', '$rootScope','$mdToast','$mdDialog','$scope'];
	function LoginController($location, AuthenticationService, $rootScope, $mdToast,$mdDialog,$scope) {
			$rootScope.toolBarName = "PRONO FOOTBALL CLUB";
	    	var vm = this;
	        vm.login = login;

	        const displayNews = false;
	 
	        (function initController() {
	            // reset login status
	            AuthenticationService.ClearCredentials();
	        })();

	        function showNews() {
		      $mdDialog.show({
		        controller: ['$scope','$mdDialog',DialogController],
		        templateUrl: 'login/newsDialog.html',
		        parent: angular.element(document.body),
		        clickOutsideToClose:false,
		        fullscreen: true // Only for -xs, -sm breakpoints.
		      })
		      .then(function(answer) {
		        vm.dataLoading = false;
                $rootScope.user.name = vm.username;
                if($rootScope.oldURL){
                	var path = $rootScope.oldURL;
                	$rootScope.oldURL = undefined;
                	$location.path(path);
                }else{
                	$location.path('/');
                }
		      }, function() {
		        
		      });
		    };

		    function DialogController($scope, $mdDialog){
		      	$scope.hide = function() {
		          $mdDialog.hide();
		        };

		        $scope.cancel = function() {
		          $mdDialog.cancel();
		        };

		        $scope.answer = function() {
		          $mdDialog.hide();
		        };
		    }
	 
	        function login() {
	            vm.dataLoading = true;
	            AuthenticationService.Login(vm.username, vm.password)
	            	.then(function(response){
	            		var response = response.data;
		                if (response.token) {
		                    AuthenticationService.SetCredentials(response.token);
		                    if(!displayNews){
		                    	vm.dataLoading = false;
			                    $rootScope.user.name = vm.username;
			                    if($rootScope.oldURL){
			                    	var path = $rootScope.oldURL;
			                    	$rootScope.oldURL = undefined;
			                    	$location.path(path);
			                    }else{
			                    	$location.path('/');
			                    }
		                    }else{
		                    	showNews();
		                    }   
		                } else {
		                    vm.dataLoading = false;
		              		$mdToast.show(
		                      $mdToast.simple()
		                        .textContent('Identifiant ou mot de passe incorrect')
		                        .position('top')
		                        .hideDelay(3000)
		                    );
		                }
	            	})
	            	.catch(function(err){
	            		vm.dataLoading = false;
	              		$mdToast.show(
	                      $mdToast.simple()
	                        .textContent('Identifiant ou mot de passe incorrect')
	                        .position('top')
	                        .hideDelay(3000)
	                    );
	            	});
	        };
	  };