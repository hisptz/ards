'use strict';

/* App Module */

var cms = angular.module('cms',
                    ['ui.bootstrap', 
                     'ngRoute', 
                     'ngCookies', 
                     'ngSanitize',
                     'highcharts-ng',
                     'datatables',
                     'ckeditor',
                     'isteven-multi-select',
                     'cmsDirectives',
                     'cmsControllers',
                     'cmsServices',
                     'cmsFilters',
                     'd2Services',
                     'd2Controllers',
                     'pascalprecht.translate',
                     'd2HeaderBar'])
              
.value('DHIS2URL', '../../..')

.config(function($translateProvider,$routeProvider) {
	
	$routeProvider.when('/home', {
        templateUrl: 'views/partials/home.html',
        controller: 'MainController'
    }).when('/home/:tabId/tab', {
        templateUrl: 'views/partials/home.html',
        controller: 'homeController'
    }).when('/cms', {
        templateUrl: 'views/partials/cms.html',
        controller: 'cmsController'
    }).when('/cms/articles', {
        templateUrl: 'views/partials/cms.html',
        controller: 'cmsController'
    }).when('/cms/menus', {
        templateUrl: 'views/partials/cms.html',
        controller: 'cmsController'
    }).when('/cms/messages', {
        templateUrl: 'views/partials/cms.html',
        controller: 'cmsController'
    }).when('/cms/information', {
        templateUrl: 'views/partials/cms.html',
        controller: 'cmsController'
    }).when('/cms/:mainTabId/:tabId/tab', {
        templateUrl: 'views/partials/cms.html',
        controller: 'cmsController'
    }).otherwise({
        redirectTo : '/home'
    });
     
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});
