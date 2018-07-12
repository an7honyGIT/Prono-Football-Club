 
    angular
        .module('pfcApp')
        .factory('MatchService', MatchService);
 
    MatchService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService', 'API_BASE_URL'];
    function MatchService($http, $cookies, $rootScope, $timeout, UserService,API_BASE_URL) {
        var service = {};
 
        service.matchesOfTheDay = MatchesOfTheDay;
        service.allMatches = AllMatches;
        service.bets = BetByUser;
        service.allGroups = AllGroups;
        service.group = GetGroup;
        service.ranking = GetRanking;
        service.leaveGroup = LeaveGroup;
        service.createGroup = CreateGroup,
        service.joinGroup = JoinGroup,
        service.doABet = DoABet;
        service.usersOfTheDay = UsersOfTheDay;
        service.matchBets = MatchBets;
        service.teamMatches = TeamMatches;
        service.getUser = GetUser;
        service.lastBet = lastBet;
        service.userBets = getUserBets;
        service.allTeams = getAllTeams;
        service.rankingEvolution = GetRankingEvolution;
        return service;

        function MatchesOfTheDay(){
            var date = new Date();
            var dayString = date.getUTCFullYear()+"-"+(date.getUTCMonth()+1)+"-"+date.getUTCDate();
            return $http.get(API_BASE_URL+'/matchs?date='+dayString);
        }

        function GetUser(){
            return $http.get(API_BASE_URL+'/users/me');
        }

        function TeamMatches(id){
            return $http.get(API_BASE_URL+'/matchs/teams/'+id);
        }

        function MatchBets(id){
            return $http.get(API_BASE_URL+'/matchs/'+id+'/bet');
        }

        function UsersOfTheDay(){
            var date = new Date();
            date.setDate(date.getDate()-1);
            var dayString = date.getUTCFullYear()+"-"+(date.getUTCMonth()+1)+"-"+date.getUTCDate();
            return $http.get(API_BASE_URL+'/groups/1/standing?fromdate='+dayString);
        }

        function AllMatches() {
            return $http.get(API_BASE_URL+'/matchs');
        }
 
        function BetByUser() {
            return $http.get(API_BASE_URL+'/users/me/bet');
        }

        function getUserBets(id){
            return $http.get(API_BASE_URL+'/users/'+id+'/bet');
        }

        function AllGroups(){
            return $http.get(API_BASE_URL+'/users/me/members');
        }

        function GetGroup(id){
            return $http.get(API_BASE_URL+'/groups/'+id);
        }

        function GetRanking(id, fromDate, toDate){
            var query = '?';
            if(fromDate) query+='fromdate='+fromDate+'&';
            if(toDate) query+='todate='+toDate+'&';
            return $http.get(API_BASE_URL+'/groups/'+id+'/standing'+query);
        }

        function GetRankingEvolution(id){
            return $http.get(API_BASE_URL+'/groups/'+id+'/rank');
        }

        function LeaveGroup(id){
            return $http.delete(API_BASE_URL+'/users/me/members/'+id);
        }

        function CreateGroup(group){
            return $http.post(API_BASE_URL+'/groups', group);
        }

        function JoinGroup(id){
            return $http.post(API_BASE_URL+'/users/me/members/'+id);
        }

        function DoABet(bet){
            return $http.post(API_BASE_URL+'/users/me/bet', bet);
        }
        function lastBet(bet){
            return $http.get(API_BASE_URL+'/bet', bet);
        }

        function getAllTeams(){
            return $http.get(API_BASE_URL+'/teams');
        }
    }
 