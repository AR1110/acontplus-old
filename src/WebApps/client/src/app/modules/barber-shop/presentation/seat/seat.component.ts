import { Component } from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-seat',
  imports: [
    BreadcrumbComponent,
    MatDynamicCardComponent,
    ThemeButtonComponent
  ],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.scss',
})
export class SeatComponent {

}
