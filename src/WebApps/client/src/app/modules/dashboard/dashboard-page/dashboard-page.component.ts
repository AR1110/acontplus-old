import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './dashboard-page.component.html',
  styles: `
  .top-img {
    position: absolute;
    right: 0;
    top: 0;
  }

   .cardWithShadow {
    box-shadow: #919eab4d 0 0 2px,#919eab1f 0 12px 24px -4px;
}
  `
})
export class DashboardPageComponent {

  topCards = signal<any[]>(new Array(10))

}
