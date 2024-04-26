import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterOutlet } from '@angular/router';
import { GlobalRoutes } from '@core/constants/global-routes';
import { getEnumValueByKey } from '@core/utils/constant-value'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { PermissionStateService } from '@shared/store/permission-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'client';

  permissionState = inject(PermissionStateService)

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    library: FaIconLibrary) {
    library.addIconPacks(fab, fas, far);
  }

  ngOnInit() {
    let self = this;
    Object.keys(sessionStorage).forEach(function (key) {
      sessionStorage.removeItem(key);
    });

    this.route.queryParams.subscribe(params => {
      let { token, route, permission } = params;

      if (permission) {
        localStorage.setItem("permisos", permission);
        let getPermission = localStorage.getItem("permisos");
        if (getPermission){
          let {acciones} = JSON.parse(getPermission);

          this.permissionState.setState({
            permission: permission,
            accion: acciones,
            acciones: []
          })

        }
      }

      if (token) {
        if (this.authService.isLoggedIn == true) {
          localStorage.removeItem('access_token');
        }
        let route_page = getEnumValueByKey(GlobalRoutes, route);

        console.log(route)
        localStorage.setItem('access_token', token);
        self.router.navigate(['/', ...route_page.split('/')]);
      }
    });
  }
}
