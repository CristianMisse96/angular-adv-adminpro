import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoUpdateComponent } from './mantenimientos/medicos/medico-update/medico-update.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { adminGuard } from '../guards/admin.guard';
import { RouterModule, Routes } from '@angular/router';

const CHILD_ROUTES: Routes = [
      {path:'', component:DashboardComponent, data:{titulo:'Dashboard'} },
      {path:'progress', component:ProgressComponent, data:{titulo:'ProgressBar'} },
      {path:'grafica1', component:Grafica1Component, data:{titulo:'Grafica #1'}},
      {path:'account-settings', component:AccountSettingsComponent, data:{titulo:'Ajuste de cuenta'} },
      {path:'promesas', component:PromesasComponent, data:{titulo:'Promesas'} },
      {path:'rxjs', component: RxjsComponent, data:{titulo:'RxJs'} },
      {path:'perfil', component:PerfilComponent, data:{titulo:'Perfil de usuario'}},
      {path:'buscar/:termino', component:BusquedaComponent, data:{titulo:'Busquedas'}},

      //mantenimientos
      {path:'hospitales', component:HospitalesComponent, data:{titulo:'Gestión de hospitales'}},
      {path:'medicos', component:MedicosComponent, data:{titulo:'Gestión de médicos'}},
      {path:'medico/:id', component:MedicoUpdateComponent, data:{titulo:'Actualizar médico'}},

      //rutas_admin
      {path:'usuarios', canActivate:[adminGuard],component:UsuariosComponent, data:{titulo:'Gestión de usuarios'}},
]

@NgModule({
  imports: [RouterModule.forChild(CHILD_ROUTES)],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
