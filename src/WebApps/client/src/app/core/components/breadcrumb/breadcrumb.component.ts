import { Component, computed, inject, input } from '@angular/core';
import { BreadcrumbService } from '@core/services/breadcrumb.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ThemeToggle } from '@acontplus/ng-components';

@Component({
  selector: 'app-breadcrumb',
  imports: [MatIconButton, MatIcon, MatButton, RouterLink, ThemeToggle],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  separator = input('>');
  asString = input(false);
  showHome = input(true); // Customization: show/hide home button
  homeIcon = input('home'); // Customization: home icon
  chevronIcon = input('chevron_right'); // Customization: separator icon

  breadcrumbService = inject(BreadcrumbService);
  breadcrumbs = this.breadcrumbService.breadcrumbs;
  private router = inject(Router);

  // Computed para string con separador personalizado
  breadcrumbStringWithSeparator = computed(() => {
    return this.breadcrumbService.getBreadcrumbString(` ${this.separator} `);
  });

  // Mostrar el toggle de tema solo si la ruta comienza con 'legacy'
  isLegacyRoute(): boolean {
    const url = this.router.url || '';
    // Normalizar quitando query/fragmentos
    const clean = url.split('#')[0].split('?')[0];
    // Obtener primer segmento sin slashes
    const firstSegment = clean.replace(/^\/+/, '').split('/')[0]?.toLowerCase() ?? '';
    return firstSegment === 'legacy';
  }
}
