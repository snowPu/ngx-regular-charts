import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { RegularChartsService } from '../regular-charts.service';

@Component({
  selector: 'g[rc-clustered-bar-chart]',
  templateUrl: './clustered-bar-chart.component.html',
  styleUrls: ['./clustered-bar-chart.component.scss']
})
export class ClusteredBarChartComponent implements OnInit, OnChanges {

  @Input() data: [{series: string, color: string, data: [{name: string, value: number }]}];
  @Input() x: number;
  @Input() y: number;
  @Input() width: number;
  @Input() height: number;

  barPaths: any;
  // [{color: string, paths: string[]}];

  computeBarPaths() {
    this.barPaths = [];
    let uniqueXAxisValues;
    let noOfXAxisValues;
    uniqueXAxisValues = new Set();
    for (const series of this.regularChartsService.data) {
      const seriesData = series.data;
      for (const sData of seriesData) {
        uniqueXAxisValues.add(sData.name);
      }
    }
    noOfXAxisValues = uniqueXAxisValues.size;
    const noOfSeries = this.regularChartsService.data.length;
    const eachWidth = this.width / noOfXAxisValues;
    const categoryWidth = eachWidth * .5;
    const barWidth = categoryWidth / noOfSeries;
    let cnt = -1;
    let barPath = '';
    let cntSeries = -1;
    for (const bcS of this.regularChartsService.data) {
      cntSeries++;
      cnt = -1;
      let seriesPaths;
      seriesPaths = [];
      for (const bcD of bcS.data) {
        cnt ++;
        const xPos = cnt * eachWidth + .25 * eachWidth + cntSeries * barWidth + .5 * barWidth + this.x;
        const yPos = this.regularChartsService.transformY(this.regularChartsService.maxY - bcD.value) + this.y;
        const xStart = xPos - barWidth / 2;
        const xEnd = xPos + barWidth / 2;
        const yStart = this.height + this.y;
        barPath = 'M ';
        barPath = barPath + ' ' + xStart + ' ' + yStart + ' L ' + xStart
        + ' ' + yPos + ' ' + xEnd + ' ' + yPos + ' ' + xEnd + ' ' + yStart + ' Z';
        seriesPaths.push(barPath);
      }
      this.barPaths.push({color: bcS.color, paths: seriesPaths});
    }
  }

  constructor(public regularChartsService: RegularChartsService) { }

  ngOnInit() {
    this.computeBarPaths();
  }

  ngOnChanges() {
    this.computeBarPaths();
  }

}
