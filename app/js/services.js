'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var pimsServices = angular.module('PimsApp.services', []);
pimsServices.value('version', '0.1');

pimsServices.service('MessageService', [
    function () {
        this.prepareMessage = function () {
            return {
                success: {
                    flag: false,
                    body: ""
                },
                danger: {
                    flag: false,
                    body: ""
                },
                info: {
                    flag: false,
                    body: ""
                },
                warning: {
                    flag: false,
                    body: ""
                }
            }
        };
        this.setSuccessMessage = function(message, body) {
            message.success.flag = true;
            message.success.body = body;
        };
        this.setInfoMessage = function(message, body) {
            message.info.flag = true;
            message.info.body = body;
        };

        this.setWarningMessage = function(message, body) {
            message.warning.flag = true;
            message.warning.body = body;
        };

        this.setDangerMessage = function(message, body) {
            message.danger.flag = true;
            message.danger.body = body;
        }
    }]);
