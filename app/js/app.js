'use strict';

var pimsApp = angular.module('PimsApp', ['ngRoute', 'ui.sortable', 'PimsApp.services', 'ngTable', 'chart.js', 'ui.bootstrap',
    'angularSpinner','ngCookies']);


pimsApp.config(["$routeProvider", "$locationProvider", "ChartJsProvider",
    "usSpinnerConfigProvider",
    function ($routeProvider, $locationProvider, ChartJsProvider, usSpinnerConfigProvider) {
        $routeProvider

            .when('/attributes/:uuid', {
                templateUrl: 'partial/attribute/attribute',
                controller: 'AttributeController'
            })
            .when('/attributes', {
                templateUrl: 'partial/attribute/attributes',
                controller: 'AttributeListController'
            })
            .when('/entity-types/:uuid', {
                templateUrl: 'partial/entity_type/entity_type',
                controller: 'EntityTypeController'
            })
            .when('/entity-types', {
                templateUrl: 'partial/entity_type/entity_types',
                controller: 'EntityTypeListController'
            })
            .when('/attribute-sets/:uuid', {
                templateUrl: 'partial/attribute_set/attribute_set',
                controller: 'AttributeSetController'
            })
            .when('/attribute-sets', {
                templateUrl: 'partial/attribute_set/attribute_sets',
                controller: 'AttributeSetListController'
            })
            .when('/entities/:uuid', {
                templateUrl: 'partial/entity/entity',
                controller: 'EntityController'
            })
            .when('/entities', {
                templateUrl: 'partial/entity/entities',
                controller: 'EntityListController'
            })
            .when('/search', {
                templateUrl: 'partial/search/search',
                controller: 'AdvancedSearchController'
            })
            .when('/external-operations', {
                templateUrl: 'partial/external_operation/external_operations',
                controller: 'ExternalOperationListController'
            })
            .when('/external-operations/:id', {
                templateUrl: 'partial/external_operation/external_operation',
                controller: 'ExternalOperationController'
            })
            .when('/custom-sync-operations', {
                templateUrl: 'partial/custom_sync_operation/custom_sync_operations',
                controller: 'CustomSyncOperationListController'
            })
            .when('/custom-sync-operations/:id', {
                templateUrl: 'partial/custom_sync_operation/custom_sync_operation',
                controller: 'CustomSyncOperationController'
            })
            .when('/external-systems', {
                templateUrl: 'partial/external_system/external_systems',
                controller: 'ExternalSystemListController'
            })
            .when('/external-systems/:id', {
                templateUrl: 'partial/external_system/external_system',
                controller: 'ExternalSystemController'
            })
            .when('/converters', {
                templateUrl: 'partial/converter/converters',
                controller: 'ConverterListController'
            })
            .when('/converters/:id', {
                templateUrl: 'partial/converter/converter',
                controller: 'ConverterController'
            })
            .when('/transformation-schemata', {
                templateUrl: 'partial/transformation_schema/transformation_schemata',
                controller: 'TransformationSchemaListController'
            })
            .when('/transformation-schemata/:id', {
                templateUrl: 'partial/transformation_schema/transformation_schema',
                controller: 'TransformationSchemaController'
            })
            .when('/users', {
                templateUrl: 'partial/user/users',
                controller: 'UserListController'
            })
            .when('/users/:id', {
                templateUrl: 'partial/user/user',
                controller: 'UserController'
            })
            .when('/groups', {
                templateUrl: 'partial/group/groups',
                controller: 'GroupListController'
            })
            .when('/groups/:id', {
                templateUrl: 'partial/group/group',
                controller: 'GroupController'
            })
            .when('/', {
                templateUrl: 'partial/dashboard/dashboard',
                controller: 'DashboardController'
            });


        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
        usSpinnerConfigProvider.setDefaults({
            color: '#5bc0de', radius: 40, lines: 13,
            length: 28, width: 14
        });
        ChartJsProvider.setOptions({colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']})
    }]);

pimsApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('sessionInjector');
}]);


pimsApp.factory('sessionInjector', ['$cookies','$window', function($cookies,$window) {
    var sessionInjector = {
        request: function(config) {
            var token = $cookies.getObject('token');
            if(angular.isUndefined(token)){
                console.log("You are not authorised");
                $window.location.href = '/auth/login';
                }
            else
                config.headers['Authorization'] = "Bearer " +  $cookies.getObject('token');

            return config;
        }
    };
    return sessionInjector;
}]);
pimsApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('sessionInjector');
}]);
