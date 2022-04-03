import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './service/auth-guard';

// COMPONENTS
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { SignInComponent } from './page/sign-in/sign-in.component';
import { CreateRequestComponent } from './page/create-request/create-request.component';
import { SignupComponent } from './page/signup/signup.component';
import { ProfileComponent } from './page/profile/profile.component';
import { AdminDashboardComponent } from './page/admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './service/admin-guard';
import { FacultyDashboardComponent } from './page/faculty/faculty-dashboard/faculty-dashboard.component';
import { StudentGuard } from './service/student-guard';
import { FacultyGuard } from './service/faculty-guard';
import { AccountsComponent } from './page/admin/accounts/accounts.component';
import { AdminSettingsComponent } from './page/admin/admin-settings/admin-settings.component';
import { AdminRequestComponent } from './page/admin/admin-request/admin-request.component';

const routes: Routes = [
  {path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  {path : 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, StudentGuard]},
  {path : 'sign-in', component: SignInComponent},
  {path : 'create-request', component: CreateRequestComponent,  canActivate: [AuthGuard]},
  {path : 'edit/:requestId', component: CreateRequestComponent,  canActivate: [AuthGuard]},
  {path : 'sign-up', component: SignupComponent},
  {path : 'profile', component: ProfileComponent ,  canActivate: [AuthGuard]},
  {path : 'faculty-dashboard', component: FacultyDashboardComponent,  canActivate: [AuthGuard, FacultyGuard] },

  //ADMIN GUARDS
  {path : 'admin-dashboard', component: AdminDashboardComponent,  canActivate: [AuthGuard, AdminGuard] },
  {path : 'accounts', component: AccountsComponent,  canActivate: [AuthGuard, AdminGuard] },
  {path : 'admin-request', component: AdminRequestComponent,  canActivate: [AuthGuard, AdminGuard] },
  {path : 'admin-settings', component: AdminSettingsComponent,  canActivate: [AuthGuard, AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
