import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy{

  medicos: Medico[]=[];
  cargando: boolean=true;
  medicosTemp: Medico[]=[];
  imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) {
    
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs= this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe(()=>this.cargarMedicos());
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos()
    .subscribe({
      next: (medicos)=>{
        this.cargando=false;
        this.medicosTemp=medicos;
        this.medicos=medicos;
      },
    });
  }

  buscarMedico(termino: string) {
    if(termino.length ===0){
      this.medicos=this.medicosTemp;
      return;
    }

    this.busquedaService.buscar('medicos', termino)
        .subscribe({
          next: (resultados)=>{
            this.medicos=resultados;
          }
        })
  }

  borrarMedico(medico : Medico){

    Swal.fire({
      title: "Borrar Medico!!!",
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "si, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {console.log(medico._id);
        this.medicoService.borrarMedico(medico._id).subscribe({ 
          next: ()=>{
            this.cargarMedicos();
            Swal.fire({
              title: "Medico eliminado",
              text: `Médico ${medico.nombre} ha sido eliminado correctamente`,
              icon: "success",
              showConfirmButton:false,
              timer:1500
            });
          },
        });
      }
    });
}

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos',medico._id,false,medico.img);
  }
}
