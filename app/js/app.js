'use strict';

var pimsApp = angular.module('PimsApp', ['ngRoute', 'ui.sortable', 'PimsApp.services',  'ngTable','chart.js', 'ui.bootstrap']);


pimsApp.config(["$routeProvider","$locationProvider", "ChartJsProvider",
    function ($routeProvider, $locationProvider, ChartJsProvider) {
    $routeProvider

        .when('/attributes/:uuid', {
            templateUrl: 'partial/attribute/attribute',
            controller: 'AttributeController'
        })
        .when('/attributes', {
            templateUrl: 'partial/attribute/attributes',
            controller: 'AttributeListController'
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
        .when('/external-operations', {
            templateUrl: 'partial/external_operation/external_operations',
            controller: 'ExternalOperationListController'
        })
        .when('/external-operations/:id', {
            templateUrl: 'partial/external_operation/external_operation',
            controller: 'ExternalOperationController'
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
        .when('/',{
            templateUrl: 'partial/dashboard/dashboard',
            controller: 'DashboardController'
        });



    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] })}]);