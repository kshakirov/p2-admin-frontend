'use strict';

var pimsApp = angular.module('PimsApp', ['ngRoute', 'ui.sortable', 'PimsApp.services',  'ngTable']);

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
        $http.get("/pims/rest/entity-types").then(function (entities) {
            $rootScope.pims = {
                entities: {
                    current: choose_product(entities.data),
                    list: entities.data
                }
            }
        })
        //$http.get("pims");
        console.log("dfdf")
    }
}]);

pimsApp.config(["$routeProvider","$locationProvider", function ($routeProvider, $locationProvider) {
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
        });


    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
}]);