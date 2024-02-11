import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit,OnDestroy{

  totalUsuarios:number=0;
  usuarios: Usuario[]=[];
  usuariosTemp: Usuario[]=[];
  desde:number=0;
  cargando:boolean=true;
  imgSubs:Subscription;

  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService){}
 
  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs= this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe(()=>this.cargarUsuarios());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }


  private cargarUsuarios() {
    this.cargando=true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe({
      next: ({ total, usuarios }) => {
        this.usuarios = usuarios;
        this.usuariosTemp=usuarios;
        this.totalUsuarios = total;
        this.cargando=false;
      },
    });
  }

  cambiarPagina(valor:number){
    this.desde=valor;

    if(this.desde<0){
      this.desde=0;
    }else if(this.desde>=this.totalUsuarios){
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino:string){
    
    if(termino.length ===0){
      this.usuarios=this.usuariosTemp;
      return;
    }

    this.busquedaService.buscar('usuarios', termino)
        .subscribe({
          next: (resultados:Usuario[])=>{
            this.usuarios=resultados;
          }
        })
  }


  eliminarUsuario(usuario: Usuario){

    if(usuario.uid=== this.usuarioService.uid){
      Swal.fire('Error','no puede borrarse a si mismo','error')
    }

    Swal.fire({
      title: "Borrar usuario!!!",
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "si, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe({
          next: (resp)=>{
            this.cargarUsuarios();
            Swal.fire({
              title: "Usuario eliminado",
              text: `Usuario ${usuario.nombre} ha sido eliminado correctamente`,
              icon: "success"
            });
          },
        });
      }
    });
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
      .subscribe();
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios',usuario.uid,usuario.google,usuario.img);
  }

}
