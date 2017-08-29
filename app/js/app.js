'use strict';

var pimsApp = angular.module('PimsApp', ['ngRoute', 'ui.sortable', 'PimsApp.services',  'ngTable','chart.js']);

pimsApp.controller('SystemConfigController',["$scope", "$rootScope","$http", function ($scope,  $rootScope, $http ) {

    function choose_product(entities) {
        var entity = entities.filter(function (entity) {
            if (entity.name === 'Product') {
                return entity;
            }
        });
        return entity[0]
    }

    $scope.init = function () {
        $http.get("/pims/rest/entity-types/").then(function (entities) {
            $rootScope.pims = {
                entities: {
                    current: choose_product(entities.data),
                    list: entities.data
                }
            }
        })
    }
}]);

pimsApp.controller('DashboardController',["$scope", "$rootScope","$http", function ($scope,  $rootScope, $http ) {
    $scope.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

    $scope.data_radar = [
        [65, 59, 90, 81, 56, 55, 40],
        [28, 48, 40, 19, 96, 27, 100]
    ];
    $scope.labels_doughnut = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data_doughnut = [300, 500, 100];
}]);

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
        .when('/',{
            templateUrl: 'partial/dashboard/dashboard',
            controller: 'DashboardController'
        })



    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] })}]);