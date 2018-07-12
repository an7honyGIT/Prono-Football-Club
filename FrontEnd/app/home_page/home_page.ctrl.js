
/**
 * @ngdoc function
 * @name pfcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pfcApp
 */
angular.module('pfcApp')
  .controller('HomePageController', ['$scope', '$mdDialog', '$rootScope', 'MatchService', '$mdToast','$route','$anchorScroll','$location',function ($scope, $mdDialog, $rootScope, MatchService, $mdToast,$route,$anchorScroll,$location) {
  	$rootScope.toolBarName = "ACCUEIL";
    var self = this;
    self.dataLoading = true;
    self.playerLoading = true;
    self.matches = [];
    self.bets = [];
    self.users = [];

    self.upLoadMatches= function(){
      self.dataLoading = true;
      MatchService.matchesOfTheDay()
        .then(function(result){
          var result = result.data;
          self.matchesTmp = result;
          return MatchService.bets();
        })
        .then(function(result){
          var result = result.data;
          self.matches = self.matchesTmp;
          self.bets = result;
          self.dataLoading = false;
        })
        .catch(function(err){
          self.dataLoading = false;
          if(err.status == 404){
            self.matches = self.matchesTmp;
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
    self.upLoadMatches();


    self.upLoadUsers = function(){
      self.playerLoading = true;
      MatchService.usersOfTheDay()
      .then(function(result){
        self.playerLoading = false;
        var result = result.data.rank;
        var length = Math.min(4, result.length);
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

    self.upLoadUsers();

    self.getBet = function(match){
      var bet = self.bets.filter(function(bet){return bet.bet.matchId === match.matchId})[0];
      if(!bet){
        bet = {matchId:match.matchId, score1:undefined, score2:undefined, points:undefined};
      }else{
        bet = bet.bet;
      }
      return bet;
    }

    self.isBettable = function(match){
      var isBettable = true;
      var date = new Date(match.date);
      var matchDate = new Date();
      matchDate.setDate(date.getUTCDate());
      matchDate.setMonth(date.getUTCMonth());
      matchDate.setFullYear(date.getUTCFullYear());
      matchDate.setHours(date.getUTCHours());
      matchDate.setMinutes(date.getUTCMinutes());
      if(self.bets.filter(function(bet){return bet.bet.matchId === match.matchId}).length>0 || matchDate<= new Date()){
        isBettable = false;
      }
      return isBettable;
    }

    self.getPoints = function(match){
      var points = self.getBet(match).point;
      if(points === -1){
        return "VOIR TOUS LES PARIS";
      }
      return (points||0) + " points";
    }

    self.showBetDialog = function(ev, match, index) {
      self.id = index;
      $mdDialog.show({
        controller: ['$scope','$mdDialog','$mdToast',DialogController(match)],
        templateUrl: 'home/betDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: true // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        var bet = {
          matchId:match.matchId,
          score1:answer.team1||0,
          score2:answer.team2||0,
          double:answer.double||false,
          winner:answer.winner
        }
        MatchService.doABet(bet)
          .then(function(result){
            $mdToast.show(
              $mdToast.simple()
                .textContent('Mise enregistrée')
                .position('top')
                .hideDelay(3000)
            );
            self.upLoadMatches();
            //$route.reload();
          })
          .catch(function(error){
            $mdToast.show(
              $mdToast.simple()
                .textContent('Impossible de miser pour le moment')
                .position('top')
                .hideDelay(3000)
            );
          })
      }, function() {
        
      });
    };

  


  function DialogController(match) {
    return function($scope, $mdDialog,$mdToast){
      $scope.match = match;
      $scope.team1 = 0;
      $scope.team2 = 0;
      $scope.matchTeam1Loading = true;
      $scope.matchTeam1 = [];
      $scope.matchTeam2Loading = true;
      $scope.matchTeam2 = [];
      $scope.winTeam = 'team1';
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

        $scope.answer = function(res) {
          $mdDialog.hide({team1:$scope.team1, team2:$scope.team2, winner:$scope.winTeam, double:res});
        };
    } 
    }

    self.showAllBetsDialog = function(ev, match, index) {
      self.id = index;
      $mdDialog.show({
        controller: ['$scope','$mdDialog',AllBetsDialogController(match)],
        templateUrl: 'home/allBetsDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: true // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        
      }, function() {
        
      });
    };


  function AllBetsDialogController(match) {
    return function($scope, $mdDialog){
      $scope.match = match;
      $scope.loading = true;
      $scope.bets = [];
      $scope.nbBets = "";
      MatchService.matchBets($scope.match.matchId)
        .then(function(result){
          $scope.loading = false;
          result = result.data;
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

    self.displayDate = function(date){
      date = new Date(date);
        var month = ('0'+(date.getUTCMonth()+1)).slice(-2);
        var minutes = ('0'+date.getUTCMinutes()).slice(-2);
        return date.getUTCDate()+"/"+month+"/"+date.getUTCFullYear()+" à "+date.getUTCHours()+"h"+minutes;
    }

    self.getColor = function(match){
      var points = self.getBet(match).point;
      if(points === -1)
        return "#9E9E9E";
      else if(points <= 0 || points === undefined)
        return '#D84315';
      else if(points > 0)
        return '#4CAF50';
      else
        return '#9E9E9E';
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

    self.goToTeam = function(id){
      $location.path('/teams/'+id);
    }

  }]);