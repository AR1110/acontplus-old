import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { GroupedEstab, GroupedEstabBodega } from "@core/models/estab.model";
import { ProductService } from "@modules/inventory/services/product.service";
import { ProductSearchComponent } from '@inventory/shared/components/product/product-search/product-search.component';
import { UserSearchComponent } from '@core/components/user-search/user-search.component';
import { TarifaSelectHtmlOnly } from '@inventory/models/tarifa.model';
import { DateRangeSelectionComponent } from "@core/components/date-range-selection/date-range-selection.component";

import { TipoDoc } from '@core/models/tipo-doc.model'
import { SharedService } from "@core/services/shared.service";
import { isValidField } from "@core/utils/utils";
import { ToasterService } from "@core/services/toaster.service";
import { SALE_CODE_REPORT } from "@modules/sale/enums/sale.enum";

@Component({
  selector: 'app-rentabilidad-page',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbComponent,
    ProductSearchComponent,
    UserSearchComponent,
    DateRangeSelectionComponent
  ],
  templateUrl: './rentabilidad-page.component.html'
})

export class RentabilidadPageComponent {

  private productSvc = inject(ProductService);
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);

  estalecimientos: Array<GroupedEstab> = [];
  bodegas: Array<GroupedEstabBodega> = [];
  tarifas: Array<TarifaSelectHtmlOnly> = [];
  tiposDoc: Array<TipoDoc> = [];

  dataSearch = {
    codEstab: '',
    idBodega: 0,
    idTarifa: 0,
    idArticulo: 0,
    userName: '',
    fromDate: '',
    toDate: '',
    codDoc: '',
    idUsuario: 0,
    productChecked: false,
    userChecked: false,
    ckFecha: true
  }

  productSearchProps = {
    isSearchSimple: true
  }
  ngOnInit() {


    this.productSvc.getDataReport().subscribe({
      next: (response) => {
        let { estabs, tarifas, tiposDoc } = response;
        this.estalecimientos = estabs;
        this.tarifas = tarifas;
        this.tiposDoc = tiposDoc;
        let dataEstab = this.estalecimientos.find(estab => estab.defaultEstab);
        if (dataEstab) {
          this.dataSearch.codEstab = dataEstab.codEstab;
          this.bodegas = dataEstab.bodegas;
          let dataBodega = this.bodegas.find(bodega => bodega.defaultBodega);
          if (dataBodega) {
            this.dataSearch.idBodega = dataBodega.idBodega;
          }
        }

      }
    })


  }




  onChangeEstab() {

  }

  onUserSelected(event: any) {
    let { data } = event;
    this.dataSearch.idUsuario = data.idUsuario;
  }
  userResultEmptyInput(event: any) {
    this.dataSearch.idUsuario = 0;
  }

  onDateRangeSelection(range: { from: string, to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }



  getReport(format: 'pdf' | 'excel') {

    if (!isValidField(this.dataSearch.fromDate)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese fecha inicio'
      })
      return
    }

    if (!isValidField(this.dataSearch.toDate)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese fecha fin'
      })
      return
    }

    if (this.dataSearch.productChecked) {
      if (!isValidField(this.dataSearch.idArticulo)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Artículo'
        })
        return
      }
    }

    if (this.dataSearch.userChecked) {
      if (!isValidField(this.dataSearch.idUsuario)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Usuario'
        })
        return
      }
    }







    const dataParms = {
      tipo: 6,
      format,
      ckFecha: this.dataSearch.ckFecha,
      codEstab: isValidField(this.dataSearch.codEstab),
      codDoc: isValidField(this.dataSearch.codDoc),
      idUsuario: this.dataSearch.userChecked && isValidField(this.dataSearch.idUsuario) || null,
      idArticulo: this.dataSearch.productChecked && isValidField(this.dataSearch.idArticulo) || null,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
    }

    const parameters = {
      reportParams: JSON.stringify({ 
        codigo: SALE_CODE_REPORT.SRR,
        format,
        aditionalParams: []
      }),
      dataParams: JSON.stringify(dataParms)
    } 

    this.sharedSvc.getReport(parameters, format, true)
  }


}
