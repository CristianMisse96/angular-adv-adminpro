import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent {

  imagenSubir: File;
  imgTemp: string | ArrayBuffer;

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService,
             ) {
    
  }

  cerrarModal(){
    this.imgTemp=null;
    this.modalImagenService.cerrarModal();
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

    const id= this.modalImagenService.id;
    const tipo= this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir,tipo,id)
      .then(img=> {
          Swal.fire({
            title:'Éxito', 
            text:'se ha cambiado la imagen correctamente', 
            icon:'success',
            showConfirmButton:false,
            timer:1500
          });
          this.modalImagenService.nuevaImagen.emit(img);
          this.cerrarModal();
      })
      .catch(err=> {
        console.error(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error')
      });
  }

}


