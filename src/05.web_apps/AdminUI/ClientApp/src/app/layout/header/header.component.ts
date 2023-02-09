import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/seguridad/auth.service';

import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  logout() {
    this.subs.sink = this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['auth']);
      }
    });
  }
}
