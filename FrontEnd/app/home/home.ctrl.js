
/**
 * @ngdoc function
 * @name pfcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pfcApp
 */
angular.module('pfcApp')
  .controller('HomeController', ['$scope', '$mdDialog', '$rootScope', 'MatchService', '$mdToast','$route','$anchorScroll','$location','Common', function ($scope, $mdDialog, $rootScope, MatchService, $mdToast,$route,$anchorScroll,$location, Common) {
  	$rootScope.toolBarName = "TOUS LES MATCHS";
  	var self = this;
  	self.dataLoading = true;
  	self.matches = [];
    self.bets = [];
    self.showAll = false;
    self.id = Common.getCardId()||0;
    Common.setCardId(undefined);

    self.gotoAnchor = function(x) {
      if(self.showAll && x!=0){
        var newHash = 'card-' + x;
        if ($location.hash() !== newHash) {
          $location.hash('card-' + x);
        } 
        $anchorScroll();
      }
    };

    self.upLoadModel = function(){
      self.dataLoading = true;
      MatchService.allMatches()
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
          self.gotoAnchor(self.id);
        })
        .catch(function(err){
          self.dataLoading = false;
          if(err.status == 404){
            self.matches = self.matchesTmp;
          }else if(err.status === 403){
            $location.path('/login');
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

    self.upLoadModel();
    /*MatchService.allMatches()
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
    	});*/

        
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

    /*self.processBet = function(match){
    	let bet = self.bets.filter(bet => {return bet.matchId === match.matchId})[0];
    	//send element
    	bet.done = true;
    	console.log(bet);
    }*/

    self.setId = function(id){
      self.id = id;
    }

    self.showBetDialog = function(ev, match, index) {
      self.id = index;
	    $mdDialog.show({
	      controller: ['$scope','$mdDialog',DialogController(match)],
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
            self.upLoadModel();
            //$route.reload();
          })
          .catch(function(error){
            if(err.status === 403){
              $location.path('/login');
            }
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


    self.showAllBetsDialog = function(ev, match, index) {
      self.id = index;
      $mdDialog.show({
        controller: ['$scope','$mdDialog','$mdToast',AllBetsDialogController(match)],
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
      $scope.double = false;
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

    self.goToTeam = function(id, index){
      Common.setCardId(index);
      $location.path('/teams/'+id);
    }
  }]);