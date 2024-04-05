import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Tabulator } from 'tabulator-tables';

@Component({
  selector: 'app-establishment-page',
  standalone: true,
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './establishment-page.component.html',
  styleUrl:"./establishment-page.component.scss"
})
export class EstablishmentPageComponent {

  ngOnInit() {


    let table = document.getElementById('example-table');
    if (table) {
      new Tabulator(table, {});
    }
  }
}
