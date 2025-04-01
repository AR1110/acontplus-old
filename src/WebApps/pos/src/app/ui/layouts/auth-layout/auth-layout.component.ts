import {Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import {ThemeToggleComponent} from "@core/components/theme/theme-toggle/theme-toggle.component";
import {MatToolbar} from "@angular/material/toolbar";
import {FooterComponent} from "@core/components/footer/footer.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, FaIconComponent, ThemeToggleComponent, MatToolbar, FooterComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  title = signal<string>('Acontplus Restaurant');

}
