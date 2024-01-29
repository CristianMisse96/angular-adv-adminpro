import { Component, OnDestroy } from '@angular/core';
import { Observable, retry, interval, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

  intervalSubs : Subscription;

  constructor() {
  
    // this.retornaObservable().pipe(
    //   retry(2)
    // )
    // .subscribe( {
    //  next: (valor) => console.log('Subs: ',valor),
    //  error:(err)=> console.error('Error', err),
    //  complete: ()=> console.info('Obs Terminado')
    // }
    // );

    this.intervalSubs= this.retornaInterval().subscribe({
      next: console.log,
    })
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaInterval(){
    return  interval(100)
                        .pipe(
                          //take(10),
                          map(valor=>  valor+1),
                          filter(v=> v%2 == 0)
                        );

    
  }

  retornaObservable(){
    let i= -1;
    
    return new Observable<number>(observer=>{
      const intervalo=setInterval(()=>{
        i++;
        observer.next(i);

        if(i===4){
          clearInterval(intervalo);
          observer.complete();
        }

        if(i===2){
          observer.error(' i llego al valor de 2')
        }
      },1000);
    });
  }
}
