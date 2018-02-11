'use strict';

angular.module('app.behavior-view')

.component('weeklyProgramBehavior', {
    templateUrl: 'behaviors/weekly-program.template.html',
    bindings: {
        behavior: '<'
    },
    controller: ['$scope', '$element', '$uibModal', 'Pipelines',
    function WeeklyProgramBehaviorController($scope, $element, $uibModal, Pipelines) {
        let ctrl = this;

        ctrl.status = false;
        ctrl.saving = false;

        const resetStatus = function() {
            ctrl.status = false;
            ctrl.saving = false;
        };

        const setSaving = function() {
            ctrl.status = false;
            ctrl.saving = true;
        };

        const setStatus = function(status) {
            ctrl.saving = false;
            ctrl.status = status;
        };

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
                        const time_start = '2000-01-01 ' + hourConfig.time_start + ':00';
                        const time_end = (x < (dayConfig.length - 1)) ?
                            '2000-01-01 ' + dayConfig[x + 1].time_start + ':00' :
                            '2000-01-02 00:00:00';

                        items.add({
                            id: dayName + '_' + x,
                            group: i,
                            content: String(hourConfig.target_temperature),
                            start: new Date(time_start),
                            end: new Date(time_end),
                            type: 'range',
                            style: getRangeStyle(hourConfig.target_temperature),
                            data: {'temperature': hourConfig.target_temperature}
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
                        resetStatus();

                        item.type = 'range';
                        item.end = moment(item.start).add(1, 'h').toDate();
                        // some dummy temperature
                        item.content = String(DEFAULT_TEMPERATURE);
                        item.style = getRangeStyle(DEFAULT_TEMPERATURE);
                        item.data = {'temperature': DEFAULT_TEMPERATURE};
                        callback(item);
                    },
                    onMoving: function(item, callback) {
                        resetStatus();

                        // TODO align end to the next block today, or midnight of tomorrow
                        callback(item);
                    },
                    onUpdate: function(item, callback) {
                        resetStatus();

                        // open a popup to edit the temperature
                        const modal = $uibModal.open({
                            animation: false,
                            backdropClass: 'show',
                            templateUrl: 'behaviors/temperature-input.modal.html',
                            size: 'sm',
                            controllerAs: '$ctrl',
                            controller: function($uibModalInstance) {
                                const ctrl = this;

                                ctrl.temperature = item.data.temperature;

                                ctrl.ok = function() {
                                    $uibModalInstance.close(ctrl.temperature);
                                };

                                ctrl.cancel = function() {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            }
                        });

                        modal.result.then(function(temperature) {
                            item.content = String(temperature);
                            item.style = getRangeStyle(temperature);
                            item.data.temperature = temperature;
                            callback(item);
                        });
                    }
                };

                $scope.dataset = items;

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

        $scope.save = function() {
            // update behavior from timeline items
            const behavior_config = {};
            $scope.dataset.forEach(function(e) {
                const key = 'day' + e.group;
                if (!(key in behavior_config)) {
                    behavior_config[key] = [];
                }

                behavior_config[key].push({
                    'time_start': moment(e.start).format('HH:mm'),
                    'target_temperature': e.data.temperature
                });
            });
            console.log(behavior_config);

            // copy old parameters over
            behavior_config.mode = ctrl.behavior.config.mode;
            behavior_config.target_device_id = ctrl.behavior.target_device_id;

            setSaving();
            Pipelines.active_set_config(ctrl.behavior.order, ctrl.behavior.config)
                .then(function() {
                    setStatus('success');
                })
                .catch(function() {
                    setStatus('error');
                });
        };
    }]
});
