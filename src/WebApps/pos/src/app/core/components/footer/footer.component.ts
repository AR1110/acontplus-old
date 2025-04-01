import { Component } from '@angular/core';
import { MatMenuItem } from '@angular/material/menu';
import {
  faFacebook,
  faGooglePlay,
  faWhatsapp,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { MatIcon } from '@angular/material/icon';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
@Component({
  selector: 'app-footer',
    imports: [MatIcon, MatMenuItem, FaIconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly faFacebook = faFacebook;
  protected readonly faYoutube = faYoutube;
  protected readonly faGooglePlay = faGooglePlay;
  protected readonly faWhatsapp = faWhatsapp;
}
