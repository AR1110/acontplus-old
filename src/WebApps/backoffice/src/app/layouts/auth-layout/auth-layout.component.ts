import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { ThemeToggleComponent } from 'acontplus-ui-components';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@core/components/footer/footer.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [MatToolbar, ThemeToggleComponent, RouterOutlet, FooterComponent],
  templateUrl: './auth-layout.component.html',
  styles: `
    mat-toolbar {
      background-color: var(--background-color);
      color: var(--text-primary);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .navbar-text {
      background-color: var(--background-color);
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .border-bottom {
      border-bottom: 1px solid #dfe2e1 !important;
    }
    /*new*/
    .logo {
      transition: transform 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .app-title {
      font-weight: 500;
    }
    .flex-spacer {
      flex: 1 1 auto;
    }
  `,
})
export class AuthLayoutComponent {}
