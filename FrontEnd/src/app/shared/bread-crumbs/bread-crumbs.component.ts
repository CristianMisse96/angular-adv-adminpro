import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styles: [
  ]
})

export class BreadCrumbsComponent implements OnDestroy{
 
  titulo: string='';
  tituloSubs$ : Subscription;

  constructor(private router: Router) {
    
    this.tituloSubs$= this.getArgumentosRuta()
                          .subscribe(({ titulo }) => this.titulo = titulo);
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  private getArgumentosRuta() {
    return this.router.events.pipe(
      filter(e => e instanceof ActivationEnd && e.snapshot.firstChild === null),
      map((e: ActivationEnd) => e.snapshot.data)
    );
      
  }
}
