import {Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faFacebook,
  faGooglePlay,
  faWhatsapp,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import {ThemeToggleComponent} from "@core/components/theme/theme-toggle/theme-toggle.component";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, FaIconComponent, ThemeToggleComponent, MatToolbar],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  title = signal<string>('Acontplus Restaurant');
  protected readonly faFacebook = faFacebook;
  protected readonly faYoutube = faYoutube;
  protected readonly faGooglePlay = faGooglePlay;
  protected readonly faWhatsapp = faWhatsapp;
}
