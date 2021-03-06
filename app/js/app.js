'use strict';

var pimsApp = angular.module('PimsApp', ['ngRoute', 'ui.sortable',
    'PimsApp.services', 'ngTable', 'chart.js', 'ui.bootstrap',
    'angularSpinner','ngCookies','ui.ace','ngFileUpload','btorfs.multiselect',
    'ngFileSaver','btford.socket-io','ngNotify','720kb.datepicker','cp.ngConfirm',
    'uuid','angular-loading-bar','angularMoment']);



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
            .when('/permissions', {
                templateUrl: 'partial/permission/permissions',
                controller: 'PermissionListController'
            })
            .when('/permissions/:id', {
                templateUrl: 'partial/permission/permission',
                controller: 'PermissionController'
            })
            .when('/roles', {
                templateUrl: 'partial/role/roles',
                controller: 'RoleListController'
            })
            .when('/roles/:id', {
                templateUrl: 'partial/role/role',
                controller: 'RoleController'
            })
            .when('/resources', {
                templateUrl: 'partial/resource/resources',
                controller: 'ResourceListController'
            })
            .when('/resources/:id', {
                templateUrl: 'partial/resource/resource',
                controller: 'ResourceController'
            })
            .when('/filters', {
                templateUrl: 'partial/filter/filters',
                controller: 'FilterListController'
            })
            .when('/filters/:id', {
                templateUrl: 'partial/filter/filter',
                controller: 'FilterController'
            })
            .when('/operation-logs', {
                templateUrl: 'partial/operation_log/operation_log',
                controller: 'OperationLogController'
            })
            .when('/audits', {
                templateUrl: 'partial/audit/audit',
                controller: 'AuditListController'
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
            var token = $cookies.get('token');
            if(angular.isUndefined(token)){
                console.log("You are not authorised");
                $window.location.href = '/auth/login';
                }
            else
                config.headers['Authorization'] = "Bearer " +  $cookies.get('token');

            return config;
        }
    };
    return sessionInjector;
}]);
pimsApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('sessionInjector');
}]);



pimsApp.factory('socket', [function (socketFactory) {
    var myIoSocket = io.connect("http://10.1.1.125:3004");

    return myIoSocket;
}])
