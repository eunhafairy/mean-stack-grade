import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatTableExporterModule } from 'mat-table-exporter';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  MatPaginatorModule } from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './elements/button/button.component';
import { InputTextComponent } from './elements/input-text/input-text.component';
import { SignInComponent } from './page/sign-in/sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestComponent } from './elements/request/request.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { HeaderDashboardUserComponent } from './elements/header-dashboard-user/header-dashboard-user.component';
import { SignupComponent } from './page/signup/signup.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AuthInterceptor } from './service/auth-interceptor';
import { AdminDashboardComponent } from './page/admin/admin-dashboard/admin-dashboard.component';
import { FacultyDashboardComponent } from './page/faculty/faculty-dashboard/faculty-dashboard.component';
import { AccountsComponent} from './page/admin/accounts/accounts.component';
import { AdminRequestComponent } from './page/admin/admin-request/admin-request.component';
import { AdminSettingsComponent } from './page/admin/admin-settings/admin-settings.component';
import { MyrequestComponent } from './user/myrequest/myrequest.component';
import { SubjectsComponent } from './page/admin/subjects/subjects.component';
import { FacultyRequestComponent } from './page/faculty/faculty-request/faculty-request.component';
import { FacultyProfileComponent } from './page/faculty/faculty-profile/faculty-profile.component';
import { FacultyRequestElementComponent } from './elements/faculty-request-element/faculty-request-element.component';
import { DialogAddRequestComponent } from './elements/dialog-add-request/dialog-add-request.component';
import { DialogRejectRequestComponent } from './elements/dialog-reject-request/dialog-reject-request.component';
import { DialogRequestVerdictComponent } from './elements/dialog-request-verdict/dialog-request-verdict.component';
import { RequestFormComponent } from './elements/request-form/request-form.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddAccountComponent } from './elements/add-account/add-account.component';
import { AccountCardComponent } from './elements/account-card/account-card.component';
import { ValidityRedirectComponent } from './page/faculty/validity-redirect/validity-redirect.component';
import { DialogAddSubjectComponent } from './elements/dialog-add-subject/dialog-add-subject.component';
import { SettingsComponent } from './page/settings/settings.component';
import { DialogChangePassComponent } from './elements/dialog-change-pass/dialog-change-pass.component';
@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    InputTextComponent,
    SignInComponent,
    RequestComponent,
    DashboardComponent,
    HeaderDashboardUserComponent,
    SignupComponent,
    ProfileComponent,
    AdminDashboardComponent,
    FacultyDashboardComponent,
    AccountsComponent,
    AdminRequestComponent,
    AdminSettingsComponent,
    MyrequestComponent,
    SubjectsComponent,
    FacultyRequestComponent,
    FacultyProfileComponent,
    FacultyRequestElementComponent,
    DialogAddRequestComponent,
    DialogRejectRequestComponent,
    DialogRequestVerdictComponent,
    RequestFormComponent,
    AddAccountComponent,
    AccountCardComponent,
    ValidityRedirectComponent,
    DialogAddSubjectComponent,
    SettingsComponent,
    DialogChangePassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatTableExporterModule,
    FormsModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTabsModule,
    PdfViewerModule
    
   
  ],
  providers: [{provide: HTTP_INTERCEPTORS , useClass : AuthInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
