'use strict';

angular.module('app.utils', [])

.filter('temp_unit', function() {
    return function(input) {
        if (input && input.unit) {
            switch (input.unit) {
                case 'celsius':
                    return input.value + ' °C';
                default:
                    return input.value;
            }
        }
        else {
            return '--';
        }
    };
});

