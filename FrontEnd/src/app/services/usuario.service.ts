import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { RegisterForm } from '../interfaces/register-form-interface';
import { LoginForm } from '../interfaces/login-form-interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios-interface';

declare const google: any;

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;

  constructor(private http: HttpClient, 
              private router: Router,
              private ngZone: NgZone) {}

  validarToken(){

    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token':this.token
      }
    }).pipe(
      map((resp:any)=>{

        const{email,google,nombre,role,img,uid}= resp.usuario;

        this.usuario= new Usuario(nombre,email,'',img,google,role,uid);
        this.guardarLocalStorage(resp.token, resp.menu);

        return true;
      }),
      catchError(error=> of(false))
    );
  }

  crearUsuario(formData: RegisterForm){
    console.log(formData);
    return this.http.post(`${base_url}/usuarios`,formData)
                .pipe(
                  tap((resp:any)=>{
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );
  }

  actualizarPerfil(data:{nombre: string, email:string, role:string}){
    
    data={
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`,data,this.headers);
  }

  login(formData: LoginForm){
    console.log(formData);
    return this.http.post(`${base_url}/login`,formData)
            .pipe(
              tap((resp:any)=>{ console.log(resp);
                this.guardarLocalStorage(resp.token, resp.menu);
              })
            );
  }

  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`,{token})
                .pipe(
                  tap((resp:any)=>{
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
      
  }

  get token(){
    return localStorage.getItem('token') || '';
  }

  get uid():string{
    return this.usuario.uid || '';
  }

  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }

  get role():'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role;
  }

  cargarUsuarios(desde:number=0):Observable<CargarUsuarios>{
    
    const url= `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuarios>(url,this.headers)
                .pipe(
                  map(resp=>{
                    const usuarios= resp.usuarios.map(user=> 
                      new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid));
                    return {
                      total: resp.total,
                      usuarios
                    };
                  })
                );
  }

  eliminarUsuario(usuario:Usuario){
    const url= `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url,this.headers);
  }

  guardarUsuario(usuario:Usuario){

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`,usuario,this.headers);
  }

  guardarLocalStorage(token:string, menu:any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }
 
}
