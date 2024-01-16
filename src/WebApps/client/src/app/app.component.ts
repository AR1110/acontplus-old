import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router, RouterOutlet } from '@angular/router';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { getEnumValueByKey } from '@core/utils/constant-value'
import { AuthService } from '@modules/auth/services/auth.service';
import { GlobalRoutes } from '@core/constants/global-routes';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    library: FaIconLibrary) {
    library.addIconPacks(fab, fas, far);
  }

  ngOnInit() {
    let self = this;
    this.route.queryParams.subscribe(params => {
      let { token, route, permission } = params;

      if (permission) {
        localStorage.setItem("permisos", permission);
      }

      if (token) {
        if (this.authService.isLoggedIn == true) {
          localStorage.removeItem('access_token');
        }
        let route_page = getEnumValueByKey(GlobalRoutes, route);
        localStorage.setItem('access_token', token);
        self.router.navigate(['/', ...route_page.split('/')]);
      }
    });
  }
}
