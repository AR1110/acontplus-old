import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-technical-support-page',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './technical-support-page.component.html',
  styleUrl: './technical-support-page.component.scss'
})
export class TechnicalSupportPageComponent {

}
