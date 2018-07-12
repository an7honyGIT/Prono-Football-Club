
/**
 * @ngdoc function
 * @name pfcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pfcApp
 */
angular.module('pfcApp')
  .controller('TvController', ['$scope', '$mdDialog', '$rootScope', 'MatchService', '$mdToast','$route','$anchorScroll','$location',function ($scope, $mdDialog, $rootScope, MatchService, $mdToast,$route,$anchorScroll,$location) {
  	$rootScope.toolBarName = "TABLEAU DE BORD";
    var self = this;
    self.dataLoading = false;
    self.playerLoading = false;
    self.betLoading = false;
    self.matches = [];
    self.bets = [];
    self.users = [];

    self.upLoadMatches= function(){
      MatchService.matchesOfTheDay()
        .then(function(result){
          self.dataLoading = false;
          var result = result.data;
          self.matches = result;
        })
        .catch(function(err){
          self.dataLoading = false;
          if(err.status == 404){
            self.matches = [];
          }
          else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Impossible de récupérer les matchs et paris')
                  .position('top')
                  .hideDelay(3000)
              );
            }
        });
    }

    setInterval(self.upLoadMatches, 3000);


    self.upLoadUsers = function(){
      MatchService.usersOfTheDay()
      .then(function(result){
        self.playerLoading = false;
        var result = result.data.rank;
        var length = Math.min(10, result.length);
        result = result.slice(0,length);
        self.users = result;
      })
      .catch(function(err){
          self.playerLoading = false;
          if(err.status == 404){
            self.users = [];
          }
          else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Impossible de récupérer les joueurs du moment')
                  .position('top')
                  .hideDelay(3000)
              );
            }
        });
    }

    setInterval(self.upLoadUsers, 3000);

    self.upLoadBet = function(){
      MatchService.lastBet()
      .then(function(result){
        self.betLoading = false;
        var result = result.data;
        var length = Math.min(6, result.length);
        result = result.slice(0,length);
        self.bets = result;
      })
      .catch(function(err){
          self.betLoading = false;
          if(err.status == 404){
            self.bets = [];
          }
          else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Impossible de récupérer les paris du moment')
                  .position('top')
                  .hideDelay(3000)
              );
            }
        });
    }

    setInterval(self.upLoadBet, 3000);


  function DialogController(match) {
    return function($scope, $mdDialog,$mdToast){
      $scope.match = match;
      $scope.team1 = 0;
      $scope.team2 = 0;
      $scope.matchTeam1Loading = true;
      $scope.matchTeam1 = [];
      $scope.matchTeam2Loading = true;
      $scope.matchTeam2 = [];
      MatchService.teamMatches($scope.match.team1.teamId)
        .then(function(result){
            $scope.matchTeam1Loading = false;
            result = result.data;
            result = result.filter(function(match){ return match.score1!==null && match.score2!==null});
            $scope.matchTeam1 = result;
        })
        .catch(function(err){
            $scope.matchTeam1Loading = false;
            $scope.matchTeam1 = [];
            if(err.status == 404){
              self.matches = self.matchesTmp;
            }else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Impossible de récupérer les matchs de l\'équipe')
                  .position('top')
                  .hideDelay(3000)
              );
            }
        });
      MatchService.teamMatches($scope.match.team2.teamId)
        .then(function(result){
            $scope.matchTeam2Loading = false;
            result = result.data;
            result = result.filter(function(match){ return match.score1!==null && match.score2!==null});
            $scope.matchTeam2 = result;
        })
        .catch(function(err){
            $scope.matchTeam2Loading = false;
            $scope.matchTeam2 = [];
            if(err.status == 404){
              self.matches = self.matchesTmp;
            }else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Impossible de récupérer les matchs de l\'équipe')
                  .position('top')
                  .hideDelay(3000)
              );
            }
        });
      $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function() {
          $mdDialog.hide({team1:$scope.team1, team2:$scope.team2});
        };
    } 
    }


    self.displayDate = function(date){
      date = new Date(date);
        var month = ('0'+(date.getUTCMonth()+1)).slice(-2);
        var minutes = ('0'+date.getUTCMinutes()).slice(-2);
        return date.getUTCDate()+"/"+month+"/"+date.getUTCFullYear()+" à "+date.getUTCHours()+"h"+minutes;
    }

  }]);