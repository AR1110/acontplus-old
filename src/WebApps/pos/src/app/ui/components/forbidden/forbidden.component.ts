import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import { Location } from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
@Component({
  selector: 'app-forbidden',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {
  previousUrl: string | null = null;

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Si hay un historial de navegación, podemos obtener la URL anterior
    this.previousUrl = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString() || null;
  }

  goBack(): void {
    if (this.previousUrl) {
      this.location.back();
    } else {
      // Si no hay URL anterior, ir a la página de inicio
      this.router.navigate(['/']);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
