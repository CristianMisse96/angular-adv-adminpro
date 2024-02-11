import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';



export const authGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  return usuarioService.validarToken()
            .pipe(
              tap(estaAutenticado=>{
                if(!estaAutenticado){
                  router.navigateByUrl('/login');
                }
              })
            );
};

export const canMatch: CanMatchFn = () => {

  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  return usuarioService.validarToken()
            .pipe(
              tap(estaAutenticado=>{
                if(!estaAutenticado){
                  router.navigateByUrl('/login');
                }
              })
            );
}
