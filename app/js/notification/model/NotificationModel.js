pimsServices.service('NotificationModel', ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {

        this.notifyBatch = function (data) {
            var msg = {
                message: data
            };
            return $http.post('/control/notify/batch', msg).then(function (response) {
                return response;
            })
        };

        this.notifyEntity = function (data) {
            var msg = {
                message: data
            };
            return $http.post('/control/notify/entity', msg).then(function (response) {
                return response;
            })
        };
    }]);