import { Component, inject, output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { ThemeToggleComponent } from 'acontplus-ui-components';
import { NavUserToggleComponent } from '@core/components/nav-user-toggle/nav-user-toggle.component';
import { MatIcon } from '@angular/material/icon';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,

    MatToolbar,
    MatIconButton,
    MatIcon,
    ThemeToggleComponent,
    NavUserToggleComponent,
  ],
  templateUrl: './header.component.html',
  styles: `
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000; /* Increase to ensure the toolbar is above most elements */
      display: flex;
      align-items: center; /* Vertically center all items in the toolbar */
      padding: 0 16px; /* Adjust padding as needed */
      color: var(--text-primary);
      /*box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);*/
      .toolbar-spacer {
        flex: 1 1 auto; /* Spacer to push items apart */
      }

      .d-flex.gap-1 {
        display: flex;
        gap: 8px; /* Adjust gap between icons */
        align-items: center; /* Ensure icons and toggles are vertically centered */
      }

      .profile-image {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    app-nav-user-info-toggle {
      display: flex;
      justify-content: center;
      width: 100%; /* or a specific width */
    }
  `,
})
export class HeaderComponent {
  toggleSidenav = output();
  @ViewChild('trigger') trigger!: CdkOverlayOrigin;
}
