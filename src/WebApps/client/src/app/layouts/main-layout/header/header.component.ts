import {Component, output} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {OverlayModule} from "@angular/cdk/overlay";

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    OverlayModule,
  ],
  templateUrl: './header.component.html',
  styles: `
    mat-toolbar {
      background-color: transparent;
      position: sticky;
      top: 0;
      z-index: 1;
      // height: 40px;
      .toolbar-spacer {
        flex: 1 1 auto;
      }

      .profile-image {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }
    }


  `
})
export class HeaderComponent {
  toggleSidenav = output();


}
