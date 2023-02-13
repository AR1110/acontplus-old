import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { CookieService} from 'ngx-cookie-service'
import { InjectSessionInterceptor } from './core/interceptors/inject-session.interceptor';


import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import{ToastrModule} from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    ToastrModule.forRoot()
  ],
  providers: [CookieService,  {
    provide: HTTP_INTERCEPTORS,
    useClass: InjectSessionInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
