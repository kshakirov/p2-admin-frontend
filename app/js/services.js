'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var pimsServices = angular.module('PimsApp.services', [])
pimsServices.value('version', '0.1');
