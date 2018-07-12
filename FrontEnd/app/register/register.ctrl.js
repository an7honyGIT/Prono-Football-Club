
/**
 * @ngdoc function
 * @name pfcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pfcApp
 */
angular.module('pfcApp')
  .controller('RegisterController', ['$location', 'UserService', '$rootScope', '$mdToast','$q','AuthenticationService',
    function ($location, UserService, $rootScope, $mdToast,$q,AuthenticationService) {
		$rootScope.toolBarName = "PRONO FOOTBALL CLUB";
    	var vm = this;
 		vm.user = {};
        vm.createAccount = register;

        function isImage(src) {

            var deferred = $q.defer();

            var image = new Image();
            image.onerror = function() {
                deferred.resolve(false);
            };
            image.onload = function() {
                deferred.resolve(true);
            };
            image.src = src;

            return deferred.promise;
        }
        vm.images = [
            "http://blog.jeanviet.info/wp-content/uploads/foot-avatar.jpg",
            "http://myciv225.mondoblog.org/files/2014/06/abukm-foot.jpg",
            "https://4.bp.blogspot.com/-Uob88SDZ2-s/T3VweDc0EXI/AAAAAAAAAA0/SOmSud25Rrs/s379/footavatar.jpg",
            "https://i.skyrock.net/0256/73250256/pics/2883999386_1.jpg",
        ]
        
        vm.user.picture = vm.images[0];

        vm.select = function(url){
            vm.user.picture = url;
        }

        vm.isSelected = function(url){
            return vm.user.picture === url;
        }

        function register(){
            isImage(vm.user.picture).then(function(test) {
                if(!test){
                    vm.user.picture = vm.images[Math.floor(Math.random() * Math.floor(vm.images.length))];
                }
                register2();
            });
        }
        function register2() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    var response = response.data;
                    AuthenticationService.SetCredentials(response.token);    
                    vm.dataLoading = false;
              		$mdToast.show(
                      $mdToast.simple()
                        .textContent('Compte crée')
                        .position('top')
                        .hideDelay(3000)
                    );
                    if($rootScope.oldURL){
                        var path = $rootScope.oldURL;
                        $rootScope.oldURL = undefined;
                        $location.path(path);
                    }else{
                        $location.path('/');
                    }
                })
                .catch(function(err){
                    vm.dataLoading = false;
                    $mdToast.show(
                      $mdToast.simple()
                        .textContent("L'identifiant existe déjà")
                        .position('top')
                        .hideDelay(3000)
                    );
                });
        }
  }]);