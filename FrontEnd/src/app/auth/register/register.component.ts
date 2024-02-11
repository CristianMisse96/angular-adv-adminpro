import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css'],
})
export class RegisterComponent{


  formSubmited:boolean = false;

  registerForm: FormGroup = this.fb.group({
    nombre:['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    password: ['', [Validators.required]],
    password2:['', [Validators.required]],
    terminos: [false,[Validators.required]]
  },
  {
    validators: this.passwordsIguales('password','password2')
  }as FormControlOptions);

  constructor(private fb: FormBuilder,
              private router: Router,
              private usuarioService: UsuarioService) {  }

  crearUsuario(){
    this.formSubmited=true;
    
    if(this.registerForm.invalid){
      return;
    }
    
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe({
         next: (resp)=> this.router.navigateByUrl('/login'),
         error: (err)=>{
          Swal.fire('Error', err.error.msg, 'error');
         }
      });
  }

  campoValidado(campo: string){
   
    return this.registerForm.get(campo).invalid && this.formSubmited;
  }

  aceptaTerminos(): boolean {
    return !this.registerForm.get('terminos').value && this.formSubmited;
  }

  contrasenasNoValidas() : boolean{
    
    return !(this.registerForm.get('password').value === this.registerForm.get('password2').value) && this.formSubmited;
  }

  passwordsIguales(pass1Name : string, pass2Name : string){

    return (formGroup:FormGroup)=>{

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);
      
      if(pass1Control.value===pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual:true});
      }

    }
  }
}

