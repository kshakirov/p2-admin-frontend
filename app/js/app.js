'use strict';

angular.module('myApp', ['ngRoute'])

    .controller('AppCtrl', function($scope, $route, $routeParams, $location) {
        console.log("AppCtrl")
    })

    .controller('MyCtrl1', function($scope, $routeParams) {
        console.log("Ctrl1")
    })

    .controller('MyCtrl2', function($scope, $routeParams) {
        $scope.hello = "test";
        console.log("AppCtrl fd     f  2")
    })

    .config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/view1', {
                templateUrl: 'partial/partial1',
                controller: 'MyCtrl1'
            })
            .when('/view2', {
                templateUrl: 'partial/partial2',
                controller: 'MyCtrl2'
            })

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    });