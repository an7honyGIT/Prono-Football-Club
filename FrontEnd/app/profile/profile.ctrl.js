
/**
 * @ngdoc function
 * @name pfcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pfcApp
 */
angular.module('pfcApp')
  .controller('ProfilePageController', ['$scope','$rootScope', 'MatchService','$mdToast','UserService','$q','$route', function ($scope,$rootScope, MatchService, $mdToast, UserService,$q,$route) {
  	$rootScope.toolBarName = "PROFIL";
    var vm = this;
 		vm.user = {};
 		vm.error = false;
 		vm.dataLoading = true;
        vm.saveChanges = saveChanges;

        vm.images = [
            "http://blog.jeanviet.info/wp-content/uploads/foot-avatar.jpg",
            "http://myciv225.mondoblog.org/files/2014/06/abukm-foot.jpg",
            "https://4.bp.blogspot.com/-Uob88SDZ2-s/T3VweDc0EXI/AAAAAAAAAA0/SOmSud25Rrs/s379/footavatar.jpg",
            "https://i.skyrock.net/0256/73250256/pics/2883999386_1.jpg",
        ]
        vm.user.picture = vm.images[0];

        MatchService.getUser()
        	.then(function(result){
        		vm.dataLoading = false;
        		result = result.data;
        		vm.user.username= result.username;
        		vm.user.picture= result.picture;
        		if(!vm.images.includes(vm.user.picture))vm.images.push(vm.user.picture);
        	})
        	.catch(function(err){
        		vm.dataLoading = false;
        		vm.error = true;
        		vm.user = undefined;
        		$mdToast.show(
                  $mdToast.simple()
                    .textContent("Impossible d'afficher le profil")
                    .position('top')
                    .hideDelay(3000)
                );
        	});

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
        

        vm.select = function(url){
            vm.user.picture = url;
        }

        vm.isSelected = function(url){
            return vm.user.picture === url;
        }

        function saveChanges(){
            isImage(vm.user.picture).then(function(test) {
                if(!test){
                    vm.user.picture = vm.images[Math.floor(Math.random() * Math.floor(vm.images.length))];
                }
                putChanges();
            });
        }
        function putChanges() {
            vm.dataLoading = true;
            UserService.Update(vm.user)
                .then(function (response) {
                    var response = response.data; 
                    vm.dataLoading = false;
              		$mdToast.show(
                      $mdToast.simple()
                        .textContent('Modification effectuée')
                        .position('top')
                        .hideDelay(3000)
                    );
                    $route.reload();
                })
                .catch(function(err){
                    vm.dataLoading = false;
                    $mdToast.show(
                      $mdToast.simple()
                        .textContent("Impossible de mettre à jour, l'identifiant existe peut-être déjà")
                        .position('top')
                        .hideDelay(3000)
                    );
                });
        }

  }]);