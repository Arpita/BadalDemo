import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UnitComponent } from './unit/unit.component';


const routes: Routes = [
  { path: '', redirectTo: '/userRegistration', pathMatch: 'full' },
  { path: 'userRegistration', component: UserRegistrationComponent },
  { path: 'units', component: UnitComponent }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
