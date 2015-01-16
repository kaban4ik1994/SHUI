angular.module('app.controllers', [])
    .factory('settings', [
        '$rootScope', function ($rootScope) {
            // supported languages

            var settings = {
                languages: [
                    {
                        language: 'English',
                        translation: 'English',
                        langCode: 'en',
                        flagCode: 'us'
                    },
                    {
                        language: 'Espanish',
                        translation: 'Espanish',
                        langCode: 'es',
                        flagCode: 'es'
                    },
                    {
                        language: 'German',
                        translation: 'Deutsch',
                        langCode: 'de',
                        flagCode: 'de'
                    },
                    {
                        language: 'Korean',
                        translation: '한국의',
                        langCode: 'ko',
                        flagCode: 'kr'
                    },
                    {
                        language: 'French',
                        translation: 'français',
                        langCode: 'fr',
                        flagCode: 'fr'
                    },
                    {
                        language: 'Portuguese',
                        translation: 'português',
                        langCode: 'pt',
                        flagCode: 'br'
                    },
                    {
                        language: 'Russian',
                        translation: 'русский',
                        langCode: 'ru',
                        flagCode: 'ru'
                    },
                    {
                        language: 'Chinese',
                        translation: '中國的',
                        langCode: 'zh',
                        flagCode: 'cn'
                    }
                ],

            };

            return settings;

        }
    ])
    .controller('PageViewController', [
        '$scope', '$route', '$animate', function ($scope, $route, $animate) {
            // controler of the dynamically loaded views, for DEMO purposes only.
            /*$scope.$on('$viewContentLoaded', function() {
			
		});*/
        }
    ])
    .controller('SmartAppController', [
        '$scope', '$rootScope', '$location', 'authService', function ($scope, $rootScope, $location, authService) {
            // your main controller
            $scope.logOut = function() {
                authService.logOut();
                
                $location.path('/Login');
            };

            $scope.authentication = authService.authentication;
        }
    ])
    .controller('LangController', [
        '$scope', 'settings', 'localize', function ($scope, settings, localize) {
            $scope.languages = settings.languages;
            $scope.currentLang = settings.currentLang;
            $scope.setLang = function (lang) {
                settings.currentLang = lang;
                $scope.currentLang = lang;
                localize.setLang(lang);
            }

            // set the default language
            $scope.setLang($scope.currentLang);

        }
    ])

    // Path: /Login
    .controller('LoginController', [
     '$scope', '$rootScope', '$location', 'authService', 'ngAuthSettings', function ($scope, $rootScope, $location, authService, ngAuthSettings) {
        alert('dsa');

         $rootScope.isLoading = false;
         $rootScope.isHideHeader = true;
         $rootScope.isHideLeftPanel = true;
         $rootScope.isHideFooter = true;
         $rootScope.isHideMainContent = true;

         $scope.loginData = {
             userName: "",
             password: "",
             useRefreshTokens: false
         };

         $scope.message = null;

         $scope.deleteMessage = function() {
             $scope.message = null;
             $scope.showErrorMessages = true
         }

         $scope.login = function () {

             $scope.showErrorMessages = true;

             authService.login($scope.loginData).then(function (response) {
                 $location.path('/Home');

                 $rootScope.isHideHeader = false;
                 $rootScope.isHideLeftPanel = false;
                 $rootScope.isHideFooter = false;
                 $rootScope.isHideMainContent = false;
             },
              function (err) {
                  var errorMessage = "Login or password are not correct";
                  $scope.message = errorMessage; //err.error_description;
              });
         };

         $scope.authExternalProvider = function (provider) {

             var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

             var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                         + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                         + "&redirect_uri=" + redirectUri;
             window.$windowScope = $scope;

             var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
         };

         $scope.authCompletedCB = function (fragment) {

             $scope.$apply(function () {

                 if (fragment.haslocalaccount == 'False') {

                     authService.logOut();

                     authService.externalAuthData = {
                         provider: fragment.provider,
                         userName: fragment.external_user_name,
                         externalAccessToken: fragment.external_access_token
                     };

                     $location.path('/associate');

                 }
                 else {
                     //Obtain access token and redirect to orders
                     var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                     authService.obtainAccessToken(externalData).then(function (response) {

                         $location.path('/orders');

                     },
                  function (err) {
                      $scope.message = err.error_description;
                  });
                 }

             });
         }
     }])

    // Path: /Home
    .controller('HomeController', [
        '$scope', '$rootScope', function ($scope, $rootScope) {

        }])

    // Path: /Orders
    .controller('OrdersController', [
        '$scope', '$rootScope', 'ordersApi', function ($scope, $rootScope, orderApi) {

            console.log('order');

            $rootScope.isLoading = true;
           
            $scope.orders = [];

            $scope.init = $scope.init || function() {
                orderApi.getOrders(function(data) {
                    $rootScope.isLoading = false;
                    $scope.orders = data.Orders;
                }, function(error) {
                });
            }
        }
    ])

    // Path: /error/404
    .controller('Error404Controller', ['$scope', '$rootScope', '$location', '$window', function ($scope, $rootScope, $location, $window) {
        $rootScope.isLoading = false;
        $scope.$root.title = 'Error 404: Page Not Found';
    }]);

angular.module('app.demoControllers', [])
	.controller('WidgetDemoCtrl', ['$scope', '$sce', function ($scope, $sce) {
	    $scope.title = 'SmartUI Widget';
	    $scope.icon = 'fa fa-user';
	    $scope.toolbars = [
			$sce.trustAsHtml('<div class="label label-success">\
				<i class="fa fa-arrow-up"></i> 2.35%\
			</div>'),
			$sce.trustAsHtml('<div class="btn-group" data-toggle="buttons">\
		        <label class="btn btn-default btn-xs active">\
		          <input type="radio" name="style-a1" id="style-a1"> <i class="fa fa-play"></i>\
		        </label>\
		        <label class="btn btn-default btn-xs">\
		          <input type="radio" name="style-a2" id="style-a2"> <i class="fa fa-pause"></i>\
		        </label>\
		        <label class="btn btn-default btn-xs">\
		          <input type="radio" name="style-a2" id="style-a3"> <i class="fa fa-stop"></i>\
		        </label>\
		    </div>')
	    ];

	    $scope.content = $sce.trustAsHtml('\
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\
						consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\
						cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\
						proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
	}])

	.controller('ActivityDemoCtrl', ['$scope', function ($scope) {
	    var ctrl = this;
	    ctrl.getDate = function () {
	        return new Date().toUTCString();
	    };

	    $scope.refreshCallback = function (contentScope, done) {

	        // use contentScope to get access with activityContent directive's Control Scope
	        console.log(contentScope);

	        // for example getting your very long data ...........
	        setTimeout(function () {
	            done();
	        }, 3000);

	        $scope.footerContent = ctrl.getDate();
	    };

	    $scope.items = [
			{
			    title: 'Msgs',
			    count: 14,
			    src: 'ajax/notify/mail.html',
			    onload: function (item) {
			        console.log(item);
			        alert('[Callback] Loading Messages ...');
			    }
			},
			{
			    title: 'Notify',
			    count: 3,
			    src: 'ajax/notify/notifications.html'
			},
			{
			    title: 'Tasks',
			    count: 4,
			    src: 'ajax/notify/tasks.html',
			    //active: true
			}
	    ];

	    $scope.total = 0;
	    angular.forEach($scope.items, function (item) {
	        $scope.total += item.count;
	    })

	    $scope.footerContent = ctrl.getDate();

	}]);

