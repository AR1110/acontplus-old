import { Component, inject } from '@angular/core';
import { AtsService } from '@modules/billing/services/ats.service';

@Component({
  selector: 'app-ats-page',
  standalone: true,
  imports: [

  ],
  templateUrl: './ats-page.component.html',
  styles: ``
})
export class AtsPageComponent {

  atsSvc = inject(AtsService);


  ngOnInit(){}

}
