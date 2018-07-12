/**
 * @ngdoc function
 * @name pfcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pfcApp
 */
angular.module('pfcApp')
  .controller('TeamController', ['$scope','$rootScope','MatchService','$routeParams','$location',
  	function ($scope,$rootScope, MatchService, $routeParams,$location) {
 
    var self = this;
    self.dataLoading = true;
    $rootScope.toolBarName = "CALENDRIER DE L'ÉQUIPE";
    self.teamID = $routeParams.id;
    self.matches = [];

    MatchService.teamMatches(self.teamID)
    	.then(function(result){
    		self.dataLoading = false;
    		result = result.data;
    		self.matches = result;
    	})
    	.catch(function(err){
    		self.dataLoading = false;
    		self.matches = [];
    	});

    self.displayDate = function(date){
    	date = new Date(date);
        var month = ('0'+(date.getUTCMonth()+1)).slice(-2);
        var minutes = ('0'+date.getUTCMinutes()).slice(-2);
        return date.getUTCDate()+"/"+month+"/"+date.getUTCFullYear()+" à "+date.getUTCHours()+"h"+minutes;
    }


  }]);