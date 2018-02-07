pimsServices.service('NotificationModel', ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {

        this.notifyBatch = function (data, queue_prefix) {
            var msg = {
                message: data
            };
            return $http.post('/control/notify/batch/' + queue_prefix, msg);
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