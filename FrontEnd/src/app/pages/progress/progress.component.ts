import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [ './progress.component.css']
})
export class ProgressComponent {


  progreso1: number = 25;
  progreso2: number = 35;

  get getprogreso1():string{
    return `${this.progreso1}%`;
  }

  get getprogreso2():string{
    return `${this.progreso2}%`;
  }

  cambioValorHijo($event: number) {
    throw new Error('Method not implemented.');
  }
 
}
