import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMainComponent } from './app.main.component';
import { FdpComponent } from './pages/FicheDePaie/FicheDePaie.component';
import { LoginComponent } from './login/app.login.component';


/* @NgModule({
  imports: [
    RouterModule.forRoot([ 
       {path: '', component:  LoginComponent} ,
       
       {path: 'home', component: AppMainComponent,
       children: [
      
     
          
      {path: 'FDP', component: FdpComponent} 
       ],
       }
       
      
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { } */
@NgModule({
  imports: [
    RouterModule.forRoot([ 
      {

        path: '',component: LoginComponent},
        {path: 'home', component: AppMainComponent,
        children: [
          {path: 'FDP', component: FdpComponent} 
        ]
      }

  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }