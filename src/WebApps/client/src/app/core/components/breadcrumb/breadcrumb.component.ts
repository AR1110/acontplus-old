import { Component, computed, inject, input } from '@angular/core';
import { BreadcrumbService } from '@core/services/breadcrumb.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [MatIconButton, MatIcon, MatButton, RouterLink],
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

  // Computed para string con separador personalizado
  breadcrumbStringWithSeparator = computed(() => {
    return this.breadcrumbService.getBreadcrumbString(` ${this.separator} `);
  });
}
