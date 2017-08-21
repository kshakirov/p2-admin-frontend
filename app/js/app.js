'use strict';


// Declare app level module which depends on filters, and services
// angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngRoute']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
//     $routeProvider.when('/view1', {templateUrl: 'partial/1', controller: MyCtrl1});
//     $routeProvider.when('/view2', {templateUrl: 'partial/2', controller: MyCtrl2});
//     $routeProvider.otherwise({redirectTo: '/view1'});
//     $locationProvider.html5Mode(true);
// }]);
//
// var myApp = angular.module('myApp', []);
//
// myApp.controller('AppCtrl', ['$scope', function ($scope) {
//     $scope.greeting = 'Hola!';
//     console.log("Hello");
// }]);


angular.module('myApp', ['ngRoute'])

    .controller('AppCtrl', function($scope, $route, $routeParams, $location) {
        console.log("AppCtrl")
    })

    .controller('MyCtrl1', function($scope, $routeParams) {
        console.log("Ctrl1")
    })

    .controller('MyCtrl2', function($scope, $routeParams) {
        $scope.hello = "test";
        console.log("AppCtrl2")
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