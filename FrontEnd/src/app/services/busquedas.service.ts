import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(){
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }

  busquedaGlobal(termino: string){
    const url= `${base_url}/todo/${termino}`;
    return this.http.get(url,this.headers);
  }

  buscar(tipo:'usuarios'| 'medicos' | 'hospitales', termino: string){
    
    const url= `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url,this.headers)
              .pipe(
                map((resp:any)=> {console.log(resp);
                  switch (tipo) {
                    case 'usuarios':
                      return this.transformarUsuarios(resp.result);
                    

                    case 'hospitales':
                      return this.transformarHospitales(resp.result);

                    case 'medicos':
                      return this.transformarMedicos(resp.result);
                  
                  
                    default:
                      return [];
                  }
                })
              )
  
  }

  transformarMedicos(result: any[]): Medico[] {
    return result;
  }

  transformarUsuarios(results: any[]): Usuario[]{
    return results.map(user=> 
      new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid));
  }

  transformarHospitales(results: any[]): Hospital[]{
    return results;
  }
}
