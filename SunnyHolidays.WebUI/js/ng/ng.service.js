'use strict';
// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', ['ngResource'])
    .factory('ordersApi', [
        '$resource', function ($resource) {
            return $resource("", {}, {
                getOrders: {
                    url: urlApiOrdersGetOrdersSunnyHolidays,
                    method: 'GET',
                }
            });
        }
    ])
    .factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var authServiceFactory = {};

        var _authentication = {
            UserId: 0,
            Email: "",
            FirstName: "",
            SecondName: "",
            isAuth: false,
        };

        var _login = function (loginData) {

            var data = "userName=" + loginData.userName + "&password=" + loginData.password;

            var deferred = $q.defer();

            $http.post(urlApiAccountLogInSunnyHolidays, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {


                localStorageService.set('authorizationData', { token: response.Tokens[0].TokenData, firstName: response.Person.FirstName, secondName: response.Person.SecondName, email: response.Email, userId: response.UserId });

                _authentication.isAuth = true;
                _authentication.UserId = response.UserId;
                _authentication.Email = response.Email;
                _authentication.FirstName = response.Person.FirstName;
                _authentication.SecondName = response.Person.SecondName;

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.UserId = 0;
            _authentication.Email = "";
            _authentication.FirstName = "";
            _authentication.SecondName = "";

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.FirstName = authData.firstName;
                _authentication.SecondName = authData.secondName;
                _authentication.UserId = authData.userId;
                _authentication.Email = authData.email;
            }

        };

        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }])
    .factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = authData.token;
            }
            return config;
        }

        var _responseError = function (rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                var authData = localStorageService.get('authorizationData');

                //if (authData) {
                //    if (authData.useRefreshTokens) {
                //        $location.path('/refresh');
                //        return $q.reject(rejection);
                //    }
                //}
                authService.logOut();
                $location.path('/Login');
            }
            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }]);;
