pimsServices.service('NotificationModel', ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {

        this.notify = function (data) {
            var msg = {
                message: data
            };
            return $http.post('/control/notify', msg).then(function (response) {
                return response;
            })
        };
    }]);