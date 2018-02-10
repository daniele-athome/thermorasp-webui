'use strict';

angular.module('app.behavior-view')

.component('weeklyProgramBehavior', {
    templateUrl: 'behaviors/weekly-program.template.html',
    bindings: {
        behavior: '<'
    },
    controller: ['$scope', '$element', 'Pipelines', function WeeklyProgramBehaviorController($scope, $element, Pipelines) {
        let ctrl = this;

        const DEFAULT_TEMPERATURE = 20;

        // gradient will be derived from this interval
        const tempInterval = [15, 25];
        const tempGradient = new ColorGradient(["#00f", "#f23700"]);

        const getTemperatureColor = function(temp) {
            const percent = (temp - tempInterval[0]) / (tempInterval[1] - tempInterval[0]) * 100;
            return tempGradient.getHexColorAtPercent(percent);
        };

        const getRangeStyle = function(temp) {
            return 'font-weight: bold;' +
                'color: white;' +
                'background-color: ' + getTemperatureColor(temp);
        };

        ctrl.$postLink = function() {
            if (ctrl.behavior) {
                const container = $element.find('.weekly-timeline');

                // create a data set with groups
                let names = moment.weekdays(true);
                let groups = new vis.DataSet();
                for (let g = 0; g < names.length; g++) {
                    groups.add({id: g, content: names[g]});
                }

                // create a dataset with items
                const items = new vis.DataSet();
                for (let i = 0; i < names.length; i++) {
                    const dayName = 'day' + i;
                    const dayConfig = ctrl.behavior.config[dayName];
                    for (let x = 0; x < dayConfig.length; x++) {
                        const hourConfig = dayConfig[x];
                        const time_start = hourConfig.time_start + ':00';
                        const time_end = (x < (dayConfig.length - 1)) ?
                            (dayConfig[x + 1].time_start + ':00') : '23:59:59';

                        console.log(names[i] + ': ' + time_start + ' - ' + time_end);
                        items.add({
                            id: dayName + '_' + x,
                            group: i,
                            content: String(hourConfig.target_temperature),
                            start: '2000-01-01 ' + time_start,
                            end: '2000-01-01 ' + time_end,
                            type: 'range',
                            style: getRangeStyle(hourConfig.target_temperature)
                        });

                    }
                }

                // create visualization
                const options = {
                    editable: {
                        add: true,
                        updateTime: true,
                        updateGroup: true,
                        remove: true,
                        overrideItems: false
                    },
                    timeAxis: {
                        scale: 'hour',
                        step: 1
                    },
                    min: '2000-01-01 00:00:00',
                    max: '2000-01-02 00:00:00',
                    start: '2000-01-01 00:00:00',
                    end: '2000-01-02 00:00:00',
                    showMajorLabels: false,
                    moveable: true,
                    zoomable: true,
                    zoomMax: 24*60*60*1000,
                    zoomMin: 30*60*1000,
                    stack: false,
                    groupOrder: 'id',
                    onAdd: function(item, callback) {
                        item.type = 'range';
                        item.end = moment(item.start).add(1, 'h');
                        // some dummy temperature
                        item.content = String(DEFAULT_TEMPERATURE);
                        item.style = getRangeStyle(DEFAULT_TEMPERATURE);
                        callback(item);
                    }
                };

                $scope.timeline = new vis.Timeline(container[0]);
                $scope.timeline.setOptions(options);
                $scope.timeline.setGroups(groups);
                $scope.timeline.setItems(items);
            }
        };

        ctrl.$onDestroy = function() {
            if ($scope.timeline) {
                $scope.timeline.destroy();
                $scope.timeline = null;
            }
        };

        $scope.save = function(callback) {
            // TODO
            Pipelines.active_set_config(ctrl.behavior.order, ctrl.behavior.config)
            .then(function(res) {
                callback(res);
            });
        };
    }]
});
