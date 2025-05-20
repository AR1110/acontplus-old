import {Component, inject, signal} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { ProductSearchComponent } from '@inventory/ui/product/components/product-search/product-search.component';
import { UserSearchComponent } from '@shared/components/user-search/user-search.component';
import { TarifaSelectHtmlOnly } from '@inventory/domain/models/tarifa.model';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';

import { TipoDoc } from '@core/models/tipo-doc.model';
import { SharedService } from '@core/services/shared.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { SALE_CODE_REPORT } from '@sale/domain/enums/sale.enum';
import { GroupedSubFamilia } from '@inventory/domain/models/sub-category.model';
import { DOC_TYPE } from '@core/constants/global.constants';

import { formatDateToString } from '@core/utils/date.util';
import { ProductUseCase } from '@inventory/domain/usecases/product.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDivider} from "@angular/material/divider";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-rentabilidad-page',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    ProductSearchComponent,
    UserSearchComponent,
    DateRangeSelectionComponent,
    ThemeButtonComponent,
    MatDynamicCardComponent,
    MatCheckbox,
    MatDivider
  ],
  templateUrl: './rentabilidad-page.component.html',
})
export class RentabilidadPageComponent {
  establecimientos = signal<GroupedEstab[]>([]);
  bodegas = signal<GroupedEstabBodega[]>([]);
  tarifas = signal<TarifaSelectHtmlOnly[]>([])
  tiposDoc = signal<TipoDoc[]>([])
  subCategorias = signal<GroupedSubFamilia[]>([])
  tiposArticulo = [
    {
      codigo: 'B',
      descripcion: 'Bienes',
    },
    {
      codigo: 'S',
      descripcion: 'Servicios',
    },
  ];
  checkedSubCategorias = new FormControl('');
  dataSearch = {
    codEstab: '',
    idBodega: 0,
    idTarifa: 0,
    idArticulo: 0,
    userName: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    codDoc: '',
    idUsuario: 0,
    productChecked: false,
    userChecked: false,
    ckFecha: true,
    subCategoriaChecked: false,
    checkboxRentabCustom: false,
    porcentajeRenta: 0,
    porcentajeComision: 0,
    codigoTipoArticulo: 'B',
  };
  productSearchProps = {
    isSimpleMode: true,
  };
  private sharedSvc = inject(SharedService);
  private tS = inject(ToasterService);
  private _productUseCase = inject(ProductUseCase);
  private _tokenUseCase = inject(TokenUseCase);

  ngOnInit() {
    this._productUseCase.getDataReport().subscribe( (response) => {
        let { estabs, tarifas, tiposDoc, subCategorias } = response;
        this.establecimientos.set(estabs);
        this.tarifas.set(tarifas)
        this.tiposDoc.set(tiposDoc)
        this.subCategorias.set(subCategorias);

        let dataEstab = this.establecimientos().find(
          (estab) => estab.defaultEstab,
        );
        if (dataEstab) {
          this.dataSearch.codEstab = dataEstab.codEstab;
          this.bodegas.set(dataEstab.bodegas);
          let dataBodega = this.bodegas().find((bodega) => bodega.defaultBodega);
          if (dataBodega) {
            this.dataSearch.idBodega = dataBodega.idBodega;
          }
        }

        if (this.tarifas.length > 0) {
          let dataTarifa = this.tarifas().find((t) => t.predeterminada);
          if (dataTarifa) {
            this.dataSearch.idTarifa = dataTarifa.idTarifa;
          }
        }
    });
  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.codEstab)) {
      let dataEstab = this.establecimientos().find(
        (estab) => estab.codEstab === this.dataSearch.codEstab,
      );
      if (dataEstab) {
        this.bodegas.set(dataEstab.bodegas);
        let dataBodega = this.bodegas().find((b) => b.defaultBodega);
        if (dataBodega) {
          this.dataSearch.idBodega = dataBodega.idBodega;
        }
      }
    } else {
      this.bodegas.set([]);
      this.dataSearch.idBodega = 0;
    }
  }

  onUserSelected(event: any) {
    let { data } = event;
    this.dataSearch.idUsuario = data.idUsuario;
  }

  userclearSearch(event: any) {
    this.dataSearch.idUsuario = 0;
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  onProductSelected(event: any) {
    let data = event.data;
    this.dataSearch.idArticulo = data.idArticulo;
  }

  productclearSearch(data: any) {
    this.dataSearch.idArticulo = 0;
  }

  getReport(format: 'pdf' | 'excel') {
    let checkedSubCategorias = this.checkedSubCategorias.value;

    if (!isValidField(this.dataSearch.fromDate)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese fecha inicio',
      });
      return;
    }

    if (!isValidField(this.dataSearch.toDate)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese fecha fin',
      });
      return;
    }

    if (this.dataSearch.productChecked) {
      if (!isValidField(this.dataSearch.idArticulo)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Artículo',
        });
        return;
      }
    }

    if (this.dataSearch.checkboxRentabCustom) {
      if (
        !isValidField(this.dataSearch.porcentajeRenta) &&
        !isValidField(this.dataSearch.porcentajeComision)
      ) {
        this.tS.toastr({
          type: 'warning',
          message:
            'Ingrese el valor del porcentaje de renta o el valor del porcentaje de comisión.',
        });
        return;
      }
      // if (!isValidField(this.dataSearch.porcentajeComision)) {
      //   this.tS.toastr({
      //     type: 'warning',
      //     message: 'Ingrese el valor de porcentaje de comisión correctamente'
      //   })
      //   return
      // }
    }

    if (this.dataSearch.subCategoriaChecked) {
      if (
        checkedSubCategorias &&
        Array.isArray(checkedSubCategorias) &&
        checkedSubCategorias.length === 0
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione al menos una SubFamilia',
        });
        return;
      }
    }

    if (this.dataSearch.userChecked) {
      if (!isValidField(this.dataSearch.idUsuario)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Usuario',
        });
        return;
      }
    }

    let subCategoriasChecked =
      Array.isArray(checkedSubCategorias) && checkedSubCategorias.join(',');
    const dataParms = {
      tipo: this.getDataTipo(),
      format,
      checkBoxFecha: this.dataSearch.ckFecha,
      codEstab: isValidField(this.dataSearch.codEstab),
      idBodega: isValidField(this.dataSearch.idBodega),
      codDoc: isValidField(this.getDataCodDoc()),
      idUsuario:
        (this.dataSearch.userChecked &&
          isValidField(this.dataSearch.idUsuario)) ||
        null,
      idArticulo:
        (this.dataSearch.productChecked &&
          isValidField(this.dataSearch.idArticulo)) ||
        null,
      idTarifa: getValidId(this.dataSearch.idTarifa),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      subFamiliasChecked:
        (this.dataSearch.subCategoriaChecked && subCategoriasChecked) || null,
      porcentajeRenta: this.dataSearch.porcentajeRenta,
      porcentajeComision: this.dataSearch.porcentajeComision,
      userRoleId: this._tokenUseCase.getUserRoleId(),
    };

    const parameters = {
      hasService: true,
      reportParams: JSON.stringify({
        codigo: this.dataSearch.checkboxRentabCustom
          ? SALE_CODE_REPORT.SRRC
          : SALE_CODE_REPORT.SRR,
        format,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(dataParms),
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: format,
    });
  }

  private getDataCodDoc() {
    let codDoc = null;
    if (this.dataSearch.codDoc === DOC_TYPE.NE) {
      codDoc = this.dataSearch.codDoc;
    }
    if (this.dataSearch.codDoc === DOC_TYPE.FV) {
      codDoc = DOC_TYPE.FE;
    }
    return codDoc;
  }

  private getDataTipo() {
    let tipo;
    if (this.dataSearch.codigoTipoArticulo === 'B') {
      tipo = 3;
    }
    if (this.dataSearch.codigoTipoArticulo === 'S') {
      tipo = 4;
    }

    return tipo;
  }
}
