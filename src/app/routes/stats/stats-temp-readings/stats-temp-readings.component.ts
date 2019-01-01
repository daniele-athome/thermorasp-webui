import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as Highcharts from 'highcharts';

import { SensorService } from "../../../core/services";
import { SensorReading } from "../../../core/models";

@Component({
  selector: 'app-stats-temp-readings',
  templateUrl: './stats-temp-readings.component.html',
  styleUrls: ['./stats-temp-readings.component.scss']
})
export class StatsTempReadingsComponent implements OnInit {

  Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  chartCallback;
  loading: boolean;

  constructor(private sensorService: SensorService) {
    this.chartCallback = this.onChartCreated.bind(this);
    this.loading = true;
  }

  ngOnInit() {
    this.sensorService.readings_list(moment().subtract(14, 'day'), moment(), 'temperature').subscribe(
      (data: SensorReading[]) => {
        const series: Highcharts.SeriesLineOptions[] = [];
        data.forEach(
          (reading: SensorReading) => {
            let seriesData = series.find((seriesData: Highcharts.SeriesLineOptions) => seriesData.name == reading.sensor_id);
            if (!seriesData) {
              seriesData = {
                name: reading.sensor_id,
                lineWidth: 0.5,
                data: [],
                type: 'line',
              };
              series.push(seriesData);
            }
            const readingDate = moment(reading.timestamp);
            let currentDaySeries = false; // seriesData.data.find((val: {}) => val[0].format('YYYMMDDHHmm') == readingDate.format('YYYMMDDHHmm'));
            if (!currentDaySeries) {
              seriesData.data.push([
                readingDate.valueOf(),
                reading.value,
              ]);
            }
          }
        );

        this.chartOptions = {
          title: null,
          chart: {
            zoomType: 'x'
          },
          xAxis: {
            type: 'datetime'
          },
          yAxis: {
            title: {
              text: 'Temperature (°C)'
            },
          },
          tooltip: {
            valueDecimals: 2,
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.2f} °C</b><br/>',
          },
          series: series,
        };

        console.log(series);
      }
    );
  }

  onChartCreated(chart) {
    setTimeout(() => this.loading = false);
  }

}
