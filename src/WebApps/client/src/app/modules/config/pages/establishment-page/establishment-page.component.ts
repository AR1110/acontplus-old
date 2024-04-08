import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EstablishmentServiceService } from '@modules/config/services/sri/establishment-service.service';
import { Tabulator } from 'tabulator-tables';

@Component({
  selector: 'app-establishment-page',
  standalone: true,
  imports: [
    FontAwesomeModule,
    BreadcrumbComponent
  ],
  templateUrl: './establishment-page.component.html',
  styleUrl:"./establishment-page.component.scss"
})
export class EstablishmentPageComponent {

  private estabSvc = inject(EstablishmentServiceService);

  getEstabs(){
    this.estabSvc.getAll({}).subscribe({
      next: (response)=> {
        console.log(response)

      },
      error(err) {
          console.log(err)
      },
    })
  }

  ngOnInit() {
    this.getEstabs()
  }
}
