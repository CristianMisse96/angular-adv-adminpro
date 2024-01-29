import { Component } from '@angular/core';
import { ChartData, Color} from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  labels1: string[]=['Pan','Refresco','Tacos'];

  public data1=[10, 15, 40];
}
