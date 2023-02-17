import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {

  title = "AcontPlus"

  router = Inject(Router)
  cookieSvc = Inject(CookieService)

 



}
