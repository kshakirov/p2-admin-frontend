'use strict';

/* Filters */

pimsApp.filter('TrueOrFalse', [ function () {
    return function (input) {
        if (angular.isUndefined(input)) {
            return ''
        } else
            return input ? 'T' : 'F';
    }
}]);
