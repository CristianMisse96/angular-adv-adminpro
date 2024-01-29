import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent {

  @Input('valor') progeso: number = 10;
  @Input() btnClass : string = 'btn btn-primary';

  @Output() valorSalida : EventEmitter<number>= new EventEmitter();

  cambiarValor(valor : number){

    if(this.progeso>=100 && valor>=0){
      this.valorSalida.emit(100);
      return this.progeso=100;
       
    }

    if(this.progeso<=0 && valor<0){
      this.valorSalida.emit(0);
      return this.progeso=0;
    }
  
    return this.valorSalida.emit(this.progeso=this.progeso + valor);
   
  }

  onChanges(nuevoValor: number) {

    if(nuevoValor>=100){
      this.progeso=100;
    }else if(nuevoValor <=0){
      this.progeso=0
    }else{
      this.progeso=nuevoValor;
    }
    this.valorSalida.emit(this.progeso);
  }
}
