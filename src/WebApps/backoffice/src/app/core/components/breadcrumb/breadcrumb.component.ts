import {Component, computed, inject, input} from '@angular/core';
import { RouterLink } from '@angular/router';

import {MatButton, MatIconButton} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {BreadcrumbService} from "@core/services/breadcrumb.service";

@Component({
  selector: 'app-breadcrumb',
  imports: [ MatButton, RouterLink, MatIcon, MatIconButton],
  templateUrl: './breadcrumb.component.html',
  styles: `
    .breadcrumb-container {
      display: flex;
      flex-direction: column;
      padding: 16px;
      gap: 8px;
    }

    .breadcrumb-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .breadcrumb-nav {
      display: flex;
      align-items: center;
      gap: 4px;

      .breadcrumb-home {
        min-width: unset;
        padding: 0 8px;
      }

      .current-page {
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
      }

      /*mat-icon {*/
      /*  font-size: 18px;*/
      /*  width: 18px;*/
      /*  height: 18px;*/
      /*  color: rgba(0, 0, 0, 0.54);*/
      /*}*/
    }
  `,
})
export class BreadcrumbComponent {
   separator = input('>');
    asString = input(false)

  breadcrumbService = inject(BreadcrumbService);

  // Computed para string con separador personalizado
  breadcrumbStringWithSeparator = computed(() =>{
    return this.breadcrumbService.getBreadcrumbString(` ${this.separator} `)
  });

}
