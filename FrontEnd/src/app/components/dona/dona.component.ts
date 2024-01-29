import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit{

  doughnutChartData: ChartData<'doughnut'> = {
    datasets: []
  };
  
  ngOnInit(): void {
    console.log(this.doughnutChartLabels);
    this.doughnutChartData={
      labels: this.doughnutChartLabels,
      datasets: [
        { data: this.valores },
      ],
    }
  }

  @Input() title: string= 'Sin titulo';
     // Doughnut
  @Input('labels') doughnutChartLabels: string[] = [
      'label1',
      'label2',
      'label3',
    ];
    

  @Input('data') valores: number[]=[350, 450, 100];
  
      
    
}
