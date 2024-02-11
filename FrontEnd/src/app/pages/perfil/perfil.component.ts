import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})

export class PerfilComponent implements OnInit{

  perfilForm: FormGroup;
  usuario:Usuario;
  imagenSubir: File;
  imgTemp: string | ArrayBuffer;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService){

        this.usuario=usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm= this.fb.group({
      nombre:[this.usuario.nombre,[Validators.required]],
      email:[this.usuario.email,[Validators.required, Validators.email]],
    })
  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
        .subscribe({
          next: ()=>{
            const {nombre,email}=this.perfilForm.value;
            this.usuario.nombre=nombre;
            this.usuario.email=email;
            Swal.fire('Éxito','cambios guardados','success');
          },
          error: (err)=>{console.log(err);
            Swal.fire('Error',err.error.msg ,'error');
          }
        });
  }

  cambiarImagen($event) {
   const file :File= $event.target.files[0]
    this.imagenSubir=file;

    if(!file){return this.imgTemp=null;}

    const reader= new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend= ()=>{
      this.imgTemp= reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid)
      .then(img=> {
          this.usuario.img=img;
          Swal.fire('Éxito', 'se ha cambiado la imagen correctamente', 'success')
      })
      .catch(err=> {
        console.error(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error')
      });
  }
}
