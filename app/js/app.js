'use strict';

var pimsApp = angular.module('PimsApp', ['ngRoute','PimsApp.services',
'ngTable'])

    pimsApp.controller('SystemConfigController', function($scope, $route,
                                                          $routeParams,
                                                          $location, $http,
                                                          $rootScope) {

        function choose_product(entities) {
            var entity =  entities.filter(function (entity) {
                if(entity.name =='Product'){
                    return entity;
                }
            })
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
        }
    })

    pimsApp.config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/attributes/:uuid', {
                templateUrl: 'partial/attribute/attribute',
                controller: 'AttributeCtrl'
            })
            .when('/attributes', {
                templateUrl: 'partial/attribute/attributes',
                controller: 'AttributeListCtrl'
            })
            .when('/attribute_set', {
                templateUrl: 'partial/attribute_set/attribute_set',
                controller: 'AttributeSetCtrl'
            })

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    });