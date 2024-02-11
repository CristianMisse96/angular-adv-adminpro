import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit{

  usuarios: Usuario[]=[];
  medicos: Medico[]=[];
  hospitales: Hospital[]=[];

  constructor(private activatedRoute: ActivatedRoute,
              private busquedasService: BusquedasService,
              private router: Router) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({termino})=>{
        this.busquedaGlobal(termino);
    })
  }



  private busquedaGlobal(termino: any) {
    this.busquedasService.busquedaGlobal(termino)
      .subscribe({
        next: (resp:any)=>{
          this.usuarios=resp.usuarios;
          this.medicos=resp.medicos;
          this.hospitales=resp.hospitales;
        },
      });
  }

  abrirMedico(medico: Medico) {
    this.router.navigateByUrl(`/dashboard/medico/${medico._id}`);
  }
}
