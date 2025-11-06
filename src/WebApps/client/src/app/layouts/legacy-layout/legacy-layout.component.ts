import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout para rutas legacy provenientes de Razor Pages
 * No incluye header, sidebar ni footer - solo el componente
 */
@Component({
  selector: 'app-legacy-layout',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Sin layout, solo el componente -->
    <router-outlet />
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class LegacyLayoutComponent {}
