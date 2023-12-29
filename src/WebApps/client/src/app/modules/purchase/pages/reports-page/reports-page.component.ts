import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ActivatedRoute, Route, Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent { 
  router: Router = inject(Router); 
  clickMe(){
    this.router.navigate(['/', "purchase", "test"]);
  }
}
