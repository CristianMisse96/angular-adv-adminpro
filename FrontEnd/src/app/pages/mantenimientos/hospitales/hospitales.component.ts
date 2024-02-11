import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy{

  hospitales: Hospital[]=[];
  hospitalesTemp: Hospital[]=[];
  cargando:boolean= true;
  imgSubs: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) {
    
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs= this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe(()=>this.cargarHospitales());
  }


  private cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe({
        next: hospitales => {
          this.cargando = false;
          this.hospitalesTemp=hospitales;
          this.hospitales = hospitales;
        }
      });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital.nombre,hospital._id)
        .subscribe({
          next: ()=>{
            Swal.fire('Actualizado', hospital.nombre, 'success');
          }
        });
  }

  deleteHospital(hospital : Hospital){

      Swal.fire({
        title: "Borrar hospital!!!",
        text: `Esta a punto de borrar a ${hospital.nombre}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "si, eliminarlo!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.hospitalService.borrarHospital(hospital._id).subscribe({
            next: ()=>{console.log(hospital._id);
              this.cargarHospitales();
              Swal.fire({
                title: "Hospital eliminado",
                text: `${hospital.nombre} ha sido eliminado correctamente`,
                icon: "success"
              });
            },
          });
        }
      });
  }

  async abrirSweetAlert(){
    const {value=''} = await Swal.fire<string>({
      title:'Crear hospital',
      input: "text",
      inputLabel: "Ingrese el nombre del nuevo hospital",
      inputPlaceholder: "Nombre del hospital",
      showCancelButton: true
    });

    if(value.trim().length>0){
      this.hospitalService.crearHospital(value)
          .subscribe({
            next: (resp:any)=>{console.log(resp);
              Swal.fire('Éxito', `hospital ${value} creado.`, 'success'),
              this.hospitales.push(resp.hospital);
            }
          });
    }
  }

  buscarHospital(palabra: string) {
    if(palabra.length ===0){
      this.hospitales=this.hospitalesTemp;
      return;
    }

    this.busquedaService.buscar('hospitales', palabra)
        .subscribe({
          next: (resultados)=>{
            this.hospitales=resultados;
          }
        })
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales',hospital._id,false,hospital.img);
  }
}
