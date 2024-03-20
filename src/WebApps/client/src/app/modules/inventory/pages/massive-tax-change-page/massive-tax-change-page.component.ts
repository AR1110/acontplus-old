import { Component, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";


@Component({
  selector: 'app-massive-tax-change-page',
  standalone: true,
  imports: [
    FontAwesomeModule,
    BreadcrumbComponent
  ],
  templateUrl: './massive-tax-change-page.component.html'
})
export class MassiveTaxChangePageComponent {



  ngOnInit() {
    console.log(this)
  }
}
