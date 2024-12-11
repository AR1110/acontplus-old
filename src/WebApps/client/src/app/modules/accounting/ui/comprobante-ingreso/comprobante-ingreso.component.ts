import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
 import { finalize, Observable, of } from 'rxjs';
import {GetComprobanteIngresoUsecase} from "@accounting/core/usecases/get-comprobante-ingreso.usecase";

@Component({
  selector: 'app-comprobante-ingreso',
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './comprobante-ingreso.component.html',
  styles: ``
})
export class ComprobanteIngresoComponent {

  _getComprobanteIngresoUseCase = inject(GetComprobanteIngresoUsecase);

  data$: Observable<any[]> = of([]);
  loading = signal(false)
  ngOnInit(){

    this.loading.set(true)
    this.data$ = this._getComprobanteIngresoUseCase.getAll({estadoId: 0})

    this.data$
    .pipe(
      finalize(()=>{
        console.log('finalizando.....')
        this.loading.set(false)
      })
    )
    .subscribe(response=>{
      console.log(response)
    })
  }

}
