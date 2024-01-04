import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ActivatedRoute, Route, Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PATHS_API } from '@core/constants/constants';
import { ACCOUNTING_PATHS } from '@modules/accounting/constants/accounting_constants';
import { isApiResponse } from '@core/models/api-response';
@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  router: Router = inject(Router);
  http = inject(HttpClient);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`

  private initialed() {
    this.http.get(this.url, {
      params: {
        json: JSON.stringify({ tipo: 6 })
      }
    }).subscribe({
      next(response) {
        if (isApiResponse(response)) {
          if (response.code === "0") {
            console.log(response)
          }
          if (response.code === "1") {
            const mainData = JSON.parse(response.payload as string);
            console.log(mainData)
          }
        }
      },
      error(err) {

      },
    })
  }
  ngOnInit() {
    this.initialed()
  }

}
