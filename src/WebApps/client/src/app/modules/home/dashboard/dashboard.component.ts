import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-dashboard',
  imports: [BreadcrumbComponent, MatCard, MatCardContent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
