import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbsComponent } from './bread-crumbs/bread-crumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    BreadCrumbsComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports:[
    BreadCrumbsComponent,
    SidebarComponent,
    HeaderComponent,
  ]
})
export class SharedModule { }
