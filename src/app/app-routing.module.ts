import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './page/dashboard/dashboard.component';
import { SignInComponent } from './page/sign-in/sign-in.component';
import { CreateRequestComponent } from './page/create-request/create-request.component';
import { SignupComponent } from './page/signup/signup.component';
import { ProfileComponent } from './page/profile/profile.component';


const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {path : 'dashboard', component: DashboardComponent},
  {path : 'sign-in', component: SignInComponent},
  {path : 'create-request', component: CreateRequestComponent},
  {path : 'edit/:requestId', component: CreateRequestComponent},
  {path : 'sign-up', component: SignupComponent},
  {path : 'profile', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
