import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { REPORT_CODE, DOC_TYPE } from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { TipoDoc } from '@core/models/tipo-doc.model';
import { isValidField, removeSpacesInValue } from '@core/utils/utils';
import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/data/models/subentidad-financiera.model';
import { SharedService } from '@core/services/shared.service';
import { FormsModule } from '@angular/forms';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { BancoSelectOnly } from '@accounting/shared/models/banco.interface';
import { formatDateToString } from '@core/utils/date.util';
import { ComprobanteIngresoUseCase } from '@accounting/data/comprobante-ingreso.use-case';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

type TipoDocSelect = Pick<TipoDoc, 'descripcion'> & { codDoc: string };
@Component({
  selector: 'app-reporte-cobros-page',
  templateUrl: './reporte-cobros-page.html',
  styles: ``,
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    Button,
    DynamicCard,
    MatCheckbox,
    MatRadioModule,
    MatDivider,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
})
export class ReporteCobrosPage implements OnInit {
  http = inject(HttpClient);
  // VARIABLES Y CONSTANTES
  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  tiposDoc = signal<TipoDocSelect[]>([]);
  subEntidadFinanciera = signal<SubEntidadFinancieraSelectHtmlOnly[]>([]);
  bancos = signal<BancoSelectOnly[]>([]);
  users = signal<any[]>([]);
  isCustomerSearchSimple = true;
  dataSearch = {
    codEstab: '',
    idPuntoEmision: 0,
    codDoc: '',
    customerId: 0,
    idBanco: 0,
    idSubEntidadFinanciera: 0,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    supplierChecked: false,
    documentoChecked: true,
    dateChecked: true,
    nroDocChecked: false,
    nroDocument: '',
    referenceChecked: false,
    reference: '',
    loteChecked: false,
    lote: '',
    userChecked: false,
    userId: 0,
  };
  // Services
  private tS = inject(ToastrNotificationService);
  private sharedSvc = inject(SharedService);

  private _comprobanteIngresoUseCase = inject(ComprobanteIngresoUseCase);

  ngOnInit(): void {
    this.getInitialLoad();
  }

  getInitialLoad() {
    this._comprobanteIngresoUseCase.getDataFilter().subscribe((response) => {
      const { establecimientos, tiposDoc, subEntidadesFinanciera, bancos } = response;

      this.establecimientos.set(establecimientos);

      const dataEstab = this.establecimientos().find((estab) => estab.defaultEstab);

      if (dataEstab) {
        this.dataSearch.codEstab = dataEstab.codEstab;
        this.puntosEmision.set(dataEstab.puntosEmision);

        const dataPuntoEmision = this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi);
        if (dataPuntoEmision) {
          this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
        }
      }
      this.tiposDoc.set(tiposDoc);
      this.subEntidadFinanciera.set(subEntidadesFinanciera);
      this.bancos.set(bancos);
      this.dataSearch.codDoc =
        this.tiposDoc().find((tipoDoc) => tipoDoc.codDoc === DOC_TYPE.FV)?.codDoc || '';
      this.users.set(response.users);
    });
  }

  onChangeEstab() {
    if (isValidField(this.dataSearch.codEstab)) {
      const dataEstab = this.establecimientos().find(
        (estab) => estab.codEstab === this.dataSearch.codEstab,
      );
      if (dataEstab) {
        this.puntosEmision.set(dataEstab.puntosEmision);

        this.dataSearch.idPuntoEmision =
          this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi)?.idPuntoEmision || 0;
        return;
      }
    }
    this.dataSearch.idPuntoEmision = 0;
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  onCustomerSelected(data: CompanyCustomerEntity) {
    this.dataSearch.customerId = data.idCliente;
  }

  resultCustomerEmptyInput($event: any) {
    this.dataSearch.customerId = 0;
  }

  getReport(format: 'pdf' | 'excel') {
    try {
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

      if (this.dataSearch.supplierChecked) {
        if (!isValidField(this.dataSearch.customerId)) {
          this.tS.show({
            type: 'warning',
            message: 'Seleccione el cliente',
          });
          return;
        }
      }

      const userId = this.dataSearch.userChecked ? this.dataSearch.userId : null;

      const dataParms = {
        tipo: this.dataSearch.documentoChecked ? 1 : 2,
        format,
        codEstab: isValidField(this.dataSearch.codEstab),
        codDoc: isValidField(this.dataSearch.codDoc),
        idSubEntidadFinanciera: this.dataSearch.idSubEntidadFinanciera,
        idCustomer:
          (this.dataSearch.supplierChecked && isValidField(this.dataSearch.customerId)) || null,
        idPuntoEmision: this.dataSearch.idPuntoEmision,
        fechaInicio: this.dataSearch.fromDate,
        fechaFin: this.dataSearch.toDate,
        dateChecked: this.dataSearch.dateChecked,
        idBanco: this.dataSearch.idBanco,
        nroDocChecked: this.dataSearch.nroDocChecked,
        nroDocument: removeSpacesInValue(this.dataSearch.nroDocument),
        referenceChecked: this.dataSearch.referenceChecked,
        reference: removeSpacesInValue(this.dataSearch.reference),
        loteChecked: this.dataSearch.loteChecked,
        lote: removeSpacesInValue(this.dataSearch.lote),
        userId,
      };

      const parameters = {
        reportParams: JSON.stringify({
          codEstab: this.dataSearch.codEstab,
          codigo: this.dataSearch.documentoChecked ? REPORT_CODE.RCXD : REPORT_CODE.RCXC,
          format,
        }),
        dataParams: JSON.stringify(dataParms),
      };
      this.sharedSvc.getReport({ data: parameters, format: format });
    } catch (error: any) {
      if (error.status === 400) {
        this.tS.show({
          type: 'warning',
          message: 'No se pudo obtener el reporte',
        });
      } else {
        console.log(error);
      }
    }
  }
}
