import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico-update',
  templateUrl: './medico-update.component.html',
  styles: [
  ]
})
export class MedicoUpdateComponent implements OnInit{

  medicoForm: FormGroup;
  hospitales: Hospital[]=[];
  medicoSeleccionado:Medico;
  hospitalSeleccionado: Hospital;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id})=>{
      this.cargarMedico(id);
    });

    this.construirForm();
    this.cargarHospitales();
    this.findHospital();
  }
  cargarMedico(id: string) {

    if(id==='nuevo'){
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
    .pipe(delay(100))
    .subscribe({
      next: (medico)=>{

        if(!medico){
          this.router.navigateByUrl(`/dashboard/medicos`);
        }

        const {nombre, hospital:{_id}}= medico;
        this.medicoSeleccionado=medico;
        this.medicoForm.setValue({nombre, hospital:_id})
      },
    })
  }

  findHospital() {
    this.medicoForm.get('hospital').valueChanges
      .subscribe({
        next: (hospitalId)=>{
          this.hospitalSeleccionado= this.hospitales.find(h=> h._id===hospitalId);
        },
      })
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe({
        next: (hospitales)=>{
          this.hospitales=hospitales;
        },
      })
  }

  construirForm() {
    this.medicoForm= this.fb.group({
      nombre:['',[Validators.required]],
      hospital:['',[Validators.required]],
    })
  }

  guardarMedico(){

    const {nombre} = this.medicoForm.value;

    if(this.medicoSeleccionado){
      const data={
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      }
      this.medicoService.actualizarMedico(data)
          .subscribe(()=>{
            Swal.fire({
              title: 'Médico Actualizado',
              text: `médico ${nombre} actualizado con éxito`,
              icon: 'success',
              showConfirmButton: false,
              timer:1500
            });
          })
    }else{

      
    this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe({
          next: (resp:any)=>{
            Swal.fire({
              title: 'Médico creado',
              text: `médico ${nombre} creado con éxito`,
              icon: 'success',
              showConfirmButton: false,
              timer:1500
            });

            this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
          },
        });
    }
    
  }

}
