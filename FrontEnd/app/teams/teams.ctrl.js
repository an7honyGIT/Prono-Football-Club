
/**
 * @ngdoc function
 * @name pfcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pfcApp
 */
angular.module('pfcApp')
  .controller('TeamsController', ['$scope','$rootScope','MatchService','$location',
  	function ($scope,$rootScope, MatchService,$location) {
  	$rootScope.toolBarName = "LISTE DES ÉQUIPES";
    var self = this;

    self.dataLoading = true;
    self.teams = [];

   
    MatchService.allTeams()
    	.then(function(result){
    		self.dataLoading = false;
    		result = result.data;
    		self.teams = result;
    	})
    	.catch(function(err){
    		self.dataLoading = false;
    		self.teams = [];
    	});

    self.goToTeam = function(id){
      $location.path('/teams/'+id);
    }

  }]);