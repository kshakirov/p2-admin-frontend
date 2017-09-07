pimsApp.controller('DashboardController',["$scope", "$rootScope","$http", function ($scope,  $rootScope, $http ) {
    $scope.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

    $scope.data_radar = [
        [65, 59, 90, 81, 56, 55, 40],
        [28, 48, 40, 19, 96, 27, 100]
    ];
    $scope.labels_doughnut = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data_doughnut = [300, 500, 100];
}]);
