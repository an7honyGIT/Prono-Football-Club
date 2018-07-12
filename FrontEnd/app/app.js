'use strict';

/**
 * @ngdoc overview
 * @name pfcApp
 * @description
 * # pfcApp
 *
 * Main module of the application.
 */
angular
  .module('pfcApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial'
  ])
  .config(config)
  .run(run)
  .constant('API_BASE_URL', 'https://127.0.0.1:9000/v1')
  .filter('nospace', function () {
      return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
      };
    })
    //replace uppercase to regular case
    .filter('humanizeDoc', function () {
      return function (doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
          return doc.name.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
          });
        }

        return doc.label || doc.name;
      };
    });

  config.$inject = ['$routeProvider', '$locationProvider','$mdThemingProvider','$httpProvider'];
  function config($routeProvider, $locationProvider, $mdThemingProvider, $httpProvider) {
    $routeProvider
        .when('/', {
          controller: 'HomePageController',
          templateUrl: 'home_page/home_page.view.html',
          controllerAs: 'vm',
          reloadOnSearch: false
        })
        .when('/matches', {
          controller: 'HomeController',
          templateUrl: 'home/home.view.html',
          controllerAs: 'vm',
          reloadOnSearch: false
        })
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
        })
        .when('/register', {
            controller: 'RegisterController',
            templateUrl: 'register/register.view.html',
            controllerAs: 'vm'
        })
        .when('/groups', {
            controller: 'GroupsController',
            templateUrl: 'groups/groups.view.html',
            controllerAs: 'vm'
        })
        .when('/groups/:id', {
            controller: 'RankingController',
            templateUrl: 'ranking/ranking.view.html',
            controllerAs: 'vm'
        })
        .when('/teams', {
            controller: 'TeamsController',
            templateUrl: 'teams/teams.view.html',
            controllerAs: 'vm'
        })
        .when('/teams/:id', {
            controller: 'TeamController',
            templateUrl: 'teams/team.view.html',
            controllerAs: 'vm'
        })
        .when('/rules', {
            controller: 'RulesPageController',
            templateUrl: 'rules/rules.view.html',
            controllerAs: 'vm'
        })
        .when('/profile', {
            controller: 'ProfilePageController',
            templateUrl: 'profile/profile.view.html',
            controllerAs: 'vm'
        })
        .when('/tv', {
            controller: 'TvController',
            templateUrl: 'tv/tv.view.html',
            controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/login' });

    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('blue');

    //$httpProvider.interceptors.push('MyInterceptor');

  }

  run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
  function run($rootScope, $location, $cookies, $http) {
    
    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['apiKey'] = $rootScope.globals.currentUser.token;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register','/tv']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $rootScope.oldURL = $location.path();
            $location.path('/login');
        }
        if($location.path()==='/tv'){
          $rootScope.showTv = true;
        }else{
          $rootScope.showTv = false;
        }
        if($location.path()==='/login' || $location.path()==='/register' || $location.path()==='/tv'){
          $rootScope.hideSideBar = true;
        }else{
          $rootScope.hideSideBar = false;
        }
    });
  }


  angular.module('pfcApp')
  .controller('MainController', function ($rootScope, $location, $mdSidenav, menu, MatchService) {
    var self = this;
    self.root = $rootScope;
    self.root.toolBarName = "Prono Football Club";
    self.toggleSideNav = function (){
      $mdSidenav('left-side-nav')
        .toggle();
    };

    var loggedIn = $rootScope.globals.currentUser;
    self.root.user = {name:""};
    if(loggedIn){
      MatchService.getUser()
        .then(function(result){
          result = result.data;
          self.root.user.name = result.username;
        })
        .catch(function(err){

        });
    }

    self.editProfile = function(){
      console.log('pute');
      self.toggleSideNav();
      $location.path('/profile');
    }

    self.autoFocusContent = false;
    self.menu = menu;
    self.selectedSection = null;
    self.isOpen = function isOpen(section) {
      return menu.isSectionSelected(section);
    };
    self.toggleOpen = function toggleOpen(section) {
      menu.toggleSelectSection(section);
    };
  });
