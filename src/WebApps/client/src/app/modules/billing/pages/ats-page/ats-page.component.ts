import { Component, inject } from '@angular/core';
import { AtsService } from '@modules/billing/services/ats.service';
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
@Component({
  selector: 'app-ats-page',
  standalone: true,
  imports: [
     BreadcrumbComponent
  ],
  templateUrl: './ats-page.component.html',
  styles: ``
})
export class AtsPageComponent {

  atsSvc = inject(AtsService);


  ngOnInit(){}

}
