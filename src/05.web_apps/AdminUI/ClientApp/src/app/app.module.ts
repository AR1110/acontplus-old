import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule} from '@app/material.module'; //import modules material

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { HeaderComponent} from '@layout/header/header.component';
//import { PageLoaderComponent } from '@layout/page-loader/page-loader.component';
import { SidebarComponent } from '@layout/sidebar/sidebar.component';
import { AuthLayoutComponent } from '@layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from '@layout/app-layout/main-layout/main-layout.component';
import { SharedModule } from '@shared/shared.module';

import { fakeBackendProvider } from '@core/interceptor/fake-backend';
import { JwtInterceptor } from '@core/interceptor/jwt.interceptor';
import { CoreModule } from './core/core.module';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    //PageLoaderComponent,
    SidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
