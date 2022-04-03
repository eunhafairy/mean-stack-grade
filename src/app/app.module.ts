import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card'
import {MatButtonModule} from '@angular/material/button'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatIconModule} from '@angular/material/icon'
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator'
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './elements/header/header.component';
import { ButtonComponent } from './elements/button/button.component';
import { InputTextComponent } from './elements/input-text/input-text.component';
import { SignInComponent } from './page/sign-in/sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RequestComponent } from './elements/request/request.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { HeaderDashboardUserComponent } from './elements/header-dashboard-user/header-dashboard-user.component';
import { RequestService } from './service/request.service';
import { CreateRequestComponent } from './page/create-request/create-request.component';
import { SignupComponent } from './page/signup/signup.component';
import { ProfileComponent } from './page/profile/profile.component';
import { AuthInterceptor } from './service/auth-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ButtonComponent,
    InputTextComponent,
    SignInComponent,
    RequestComponent,
    DashboardComponent,
    HeaderDashboardUserComponent,
    CreateRequestComponent,
    SignupComponent,
    ProfileComponent
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
    MatPaginatorModule,
    FormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS , useClass : AuthInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
