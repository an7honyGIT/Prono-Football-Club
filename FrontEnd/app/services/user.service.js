angular
    .module('pfcApp')
    .factory('UserService', UserService);
 
    UserService.$inject = ['$http','API_BASE_URL'];
    function UserService($http,API_BASE_URL) {
        var service = {};
 
        /*service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;*/
        service.Create = Create;
        service.Update = Update;
        /*service.Delete = Delete;*/
 
        return service;
 
        /*function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }
 
        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }
 
        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }*/
 
        function Create(user) {
            return $http.post(API_BASE_URL+'/users', user);
        }
 
        function Update(user) {
            return $http.put(API_BASE_URL+'/users/me', user);
        }
 
        /*function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }*/
 
        // private functions
 
        /*function handleSuccess(res) {
            return res.data;
        }
 
        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }*/
    }