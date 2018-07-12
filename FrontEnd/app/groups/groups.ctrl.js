angular.module('pfcApp')
  .controller('GroupsController', ['$scope', '$mdDialog', '$location', '$rootScope', 'MatchService', '$mdToast','$q',
    function ($scope, $mdDialog, $location, $rootScope, MatchService, $mdToast, $q) {
  	var self = this;
    self.dataLoading = true;
    $rootScope.toolBarName = "MES GROUPES";

    self.groups = [];

  	MatchService.allGroups()
      .then(function(result){
        var result = result.data;
        self.groups = result;
        self.dataLoading = false;
      })
      .catch(function(err){
        self.dataLoading = false;
        if(err.status == 404){
          self.groups = [];
        }else{
          $mdToast.show(
          $mdToast.simple()
            .textContent('Impossible de récupérer les groupes')
            .position('top')
            .hideDelay(3000)
        );
        }
        
      });

  	//appels API pour récupérer les groupes

  	self.deleteGroup = function(id){
      MatchService.leaveGroup(id)
        .then(function(result){
          self.dataLoading = true;
          return MatchService.allGroups()
        })
        .then(function(result){
          var result = result.data;
          self.dataLoading = false;
          self.groups = result;
        })
        .catch(function(err){
          $mdToast.show(
            $mdToast.simple()
              .textContent('Impossible de quitter le groupe')
              .position('top')
              .hideDelay(3000)
          );
        })
  	}

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

    self.showCreateDialog = function(ev){
      $mdDialog.show({
        controller: CreateDialogController,
        templateUrl: 'groups/createGroupDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: true // Only for -xs, -sm breakpoints.
      })
      .then(function(group) {
        if(group.name !=='')
          isImage(group.picture).then(function(test) {
              if(!test){
                  group.picture = "https://lyon-rhone.fff.fr/wp-content/uploads/sites/105/2017/10/p05394v7.jpg";
              }
              return MatchService.createGroup(group);
          })
          .then(function(result){
            var result = result.data;
            $mdToast.show(
              $mdToast.simple()
                .textContent('Groupe crée')
                .position('top')
                .hideDelay(3000)
            );
            $location.path('/groups/'+result.groupId);
          })
          .catch(function(err){
            $mdToast.show(
              $mdToast.simple()
                .textContent('Impossible de créer le groupe')
                .position('top')
                .hideDelay(3000)
            );
          })
      }, function() {
        
      });
    }

    function CreateDialogController($scope, $mdDialog) {
      $scope.group = {name:"", picture:"", description:""};
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function() {
        $mdDialog.hide($scope.group);
      };
    }

  	self.showRanking = function(id){
  		$location.path('/groups/'+id);
  	}

    self.showAddDialog = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
        .title('Entrez l\'ID du groupe:')
        .placeholder('ID')
        .targetEvent(ev)
        .required(true)
        .ok('Rejoindre')
        .cancel('Annuler');

      $mdDialog.show(confirm).then(function(result) {
        if(result!=='')
          MatchService.joinGroup(result)
            .then(function(res){
              var res = res.data;
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Groupe rejoint')
                  .position('top')
                  .hideDelay(3000)
              );
              $location.path('/groups/'+res.groupId);
            })
            .catch(function(err){
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Impossible de rejoindre le groupe')
                  .position('top')
                  .hideDelay(3000)
              );
            })
      }, function() {
        
      });
    };


  }]);