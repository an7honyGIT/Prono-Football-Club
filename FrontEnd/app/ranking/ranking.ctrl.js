angular.module('pfcApp')
  .controller('RankingController', ['$scope', '$mdDialog', '$location', '$routeParams', '$rootScope', 'MatchService', '$mdToast',
    function ($scope, $mdDialog, $location, $routeParams, $rootScope, MatchService, $mdToast) {
  	var self = this;
    self.dataLoading = true;
    $rootScope.toolBarName = "MON CLASSEMENT";
    self.groupId = $routeParams.id;
    self.group = {};
    self.ranking = [];
    var groupJoined = false;

    MatchService.joinGroup(self.groupId)
      .then(function(res){
        var res = res.data;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Groupe rejoint')
            .position('top')
            .hideDelay(3000)
        );
        groupJoined = true;
        init();
      })
      .catch(function(err){
        groupJoined = true;
        init();
      })


    function init(){
      self.rankingType = 0;
      MatchService.group(self.groupId)
      .then(function(result){
        var result = result.data;
        self.group = result;
        $rootScope.toolBarName = self.group.name.toUpperCase();
      })
      .catch(function(err){
        $mdToast.show(
          $mdToast.simple()
            .textContent('Impossible de récupérer le groupe')
            .position('top')
            .hideDelay(3000)
        );
      });

      MatchService.rankingEvolution(self.groupId)
      .then(function(result){
        var result = result.data;
        self.ranking = result.rank;
        $rootScope.toolBarName += " ("+self.ranking.length+")";
        self.dataLoading = false;
      })
      .catch(function(err){
        self.dataLoading = false;
        $mdToast.show(
            $mdToast.simple()
              .textContent('Impossible de récupérer le classement')
              .position('top')
              .hideDelay(3000)
          );
      });
    }

    self.changeRanking = function(){
      if(groupJoined){
        switch(self.rankingType){
          case 0:
            self.dataLoading = true;
            self.ranking = [];
            MatchService.rankingEvolution(self.groupId)
              .then(function(result){
                var result = result.data;
                self.ranking = result.rank;
                self.dataLoading = false;
              })
              .catch(function(err){
                self.dataLoading = false;
                $mdToast.show(
                    $mdToast.simple()
                      .textContent('Impossible de récupérer le classement')
                      .position('top')
                      .hideDelay(3000)
                  );
              });
            break;
          case 1:
            self.dataLoading = true;
            self.ranking = [];
            MatchService.ranking(self.groupId, undefined, '2018-06-29')
              .then(function(result){
                var result = result.data;
                self.ranking = result.rank;
                self.dataLoading = false;
              })
              .catch(function(err){
                self.dataLoading = false;
                $mdToast.show(
                    $mdToast.simple()
                      .textContent('Impossible de récupérer le classement')
                      .position('top')
                      .hideDelay(3000)
                  );
              });
              break;
          case 2:
            self.dataLoading = true;
            self.ranking = [];
            MatchService.ranking(self.groupId, '2018-06-29', undefined)
              .then(function(result){
                var result = result.data;
                self.ranking = result.rank;
                self.dataLoading = false;
              })
              .catch(function(err){
                self.dataLoading = false;
                $mdToast.show(
                    $mdToast.simple()
                      .textContent('Impossible de récupérer le classement')
                      .position('top')
                      .hideDelay(3000)
                  );
              });
              break; 
        }
      }
    }

      self.showUserBets = function(ev, user) {
      console.log(name);
      $mdDialog.show({
        controller: ['$scope','$mdDialog',UserBetsDialogController(user)],
        templateUrl: 'home/userBetsDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: true // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        
      }, function() {
        
      });
    };

    function UserBetsDialogController(user) {
    return function($scope, $mdDialog){
      $scope.name = user.name;
      $scope.loading = true;
      $scope.bets = [];
      $scope.nbBets = "";
      MatchService.userBets(user.userId)
        .then(function(result){
          $scope.loading = false;
          result = result.data;
          result = result.filter(function(bet){return bet.bet.point!==-1});
          $scope.bets = result;
          $scope.nbBets = "("+$scope.bets.length+")";
        })
        .catch(function(error){
          $scope.loading = false;
          $scope.bets = [];
        });
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
    }
  }]);