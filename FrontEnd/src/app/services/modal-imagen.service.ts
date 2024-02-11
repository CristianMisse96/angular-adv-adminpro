import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal:boolean = true;
  tipo: 'usuarios' | 'medicos' | 'hospitales';
  id:string;
  img:string;
  nuevaImagen: EventEmitter<string>= new EventEmitter<string>();

  constructor() { }

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(tipo: 'usuarios' | 'medicos' | 'hospitales', 
            id:string,
            google: boolean,
            img: string='no-img'){

    this._ocultarModal=false;
    this.tipo=tipo;
    this.id=id;
    
    if(google){
      this.img=img;
    }else{
      this.img= `${base_url}/uploads/${tipo}/${img}`;
    }
  }

  cerrarModal(){
    this._ocultarModal=true;
  }
}
