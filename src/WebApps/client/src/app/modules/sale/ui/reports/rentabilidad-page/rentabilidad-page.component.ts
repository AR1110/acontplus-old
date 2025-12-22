import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject, signal, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

import { ProductSearchComponent } from '@inventory/ui/product/components/product-search/product-search.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { UserSearchComponent } from '@shared/components/user-search/user-search.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { TarifaSelectHtmlOnly } from '@inventory/data/models/tarifa.model';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';

import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { GroupedSubFamilia } from '@inventory/data/models/sub-category.model';
import { SALE_CODE_REPORT } from '@sale/domain/enums/sale.enum';
import { SharedService } from '@core/services/shared.service';
import { getValidId, isValidField } from '@core/utils/utils';
import { DOC_TYPE } from '@core/constants/global.constants';
import { TipoDoc } from '@core/models/tipo-doc.model';

import { DynamicCard, Button } from '@acontplus/ng-components';
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { formatDateToString } from '@core/utils/date.util';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

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
    Button,
    DynamicCard,
    MatCheckbox,
    MatDivider,
  ],
  templateUrl: './rentabilidad-page.component.html',
})
export class RentabilidadPageComponent implements OnInit {
  establecimientos = signal<GroupedEstab[]>([]);
  bodegas = signal<GroupedEstabBodega[]>([]);
  tarifas = signal<TarifaSelectHtmlOnly[]>([]);
  tiposDoc = signal<TipoDoc[]>([]);
  subCategorias = signal<GroupedSubFamilia[]>([]);
  taxes = signal<any[]>([]);
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
    idTipoIva: 0,
  };
  productSearchProps = {
    isSimpleMode: true,
  };
  private sharedSvc = inject(SharedService);
  private tS = inject(ToastrNotificationService);
  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);
  private _tokenUseCase = inject(TokenUseCase);

  ngOnInit() {
    this._PRODUCT_SERVICE.getDataReport().subscribe((response) => {
      const { estabs, tarifas, tiposDoc, subCategorias, taxes } = response;
      this.establecimientos.set(estabs);
      this.tarifas.set(tarifas);
      this.tiposDoc.set(tiposDoc);
      this.subCategorias.set(subCategorias);
      this.taxes.set(taxes);

      const dataEstab = this.establecimientos().find((estab) => estab.defaultEstab);
      if (dataEstab) {
        this.dataSearch.codEstab = dataEstab.codEstab;
        this.bodegas.set(dataEstab.bodegas);
        const dataBodega = this.bodegas().find((bodega) => bodega.defaultBodega);
        if (dataBodega) {
          this.dataSearch.idBodega = dataBodega.idBodega;
        }
      }

      if (this.tarifas.length > 0) {
        const dataTarifa = this.tarifas().find((t) => t.predeterminada);
        if (dataTarifa) {
          this.dataSearch.idTarifa = dataTarifa.idTarifa;
        }
      }
    });
  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.codEstab)) {
      const dataEstab = this.establecimientos().find(
        (estab) => estab.codEstab === this.dataSearch.codEstab,
      );
      if (dataEstab) {
        this.bodegas.set(dataEstab.bodegas);
        const dataBodega = this.bodegas().find((b) => b.defaultBodega);
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
    const { data } = event;
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
    const data = event.data;
    this.dataSearch.idArticulo = data.idArticulo;
  }

  productclearSearch(data: any) {
    this.dataSearch.idArticulo = 0;
  }

  getReport(format: 'pdf' | 'excel') {
    const checkedSubCategorias = this.checkedSubCategorias.value;

    if (!isValidField(this.dataSearch.fromDate)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese fecha inicio',
      });
      return;
    }

    if (!isValidField(this.dataSearch.toDate)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese fecha fin',
      });
      return;
    }

    if (this.dataSearch.productChecked) {
      if (!isValidField(this.dataSearch.idArticulo)) {
        this.tS.show({
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
        this.tS.show({
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
        this.tS.show({
          type: 'warning',
          message: 'Seleccione al menos una SubFamilia',
        });
        return;
      }
    }

    if (this.dataSearch.userChecked) {
      if (!isValidField(this.dataSearch.idUsuario)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Usuario',
        });
        return;
      }
    }

    const subCategoriasChecked =
      Array.isArray(checkedSubCategorias) && checkedSubCategorias.join(',');
    const dataParms = {
      tipo: this.getDataTipo(),
      format,
      checkBoxFecha: this.dataSearch.ckFecha,
      codEstab: isValidField(this.dataSearch.codEstab),
      idBodega: isValidField(this.dataSearch.idBodega),
      codDoc: isValidField(this.getDataCodDoc()),
      idUsuario: (this.dataSearch.userChecked && isValidField(this.dataSearch.idUsuario)) || null,
      idArticulo:
        (this.dataSearch.productChecked && isValidField(this.dataSearch.idArticulo)) || null,
      idTarifa: getValidId(this.dataSearch.idTarifa),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      subFamiliasChecked: (this.dataSearch.subCategoriaChecked && subCategoriasChecked) || null,
      porcentajeRenta: this.dataSearch.porcentajeRenta,
      porcentajeComision: this.dataSearch.porcentajeComision,
      userRoleId: this._tokenUseCase.getUserRoleId(),
      idTipoIva: getValidId(this.dataSearch.idTipoIva),
    };

    const parameters = {
      hasService: true,
      reportParams: JSON.stringify({
        codigo: this.dataSearch.checkboxRentabCustom ? SALE_CODE_REPORT.SRRC : SALE_CODE_REPORT.SRR,
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
