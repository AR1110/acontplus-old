import { ACCOUNTING_CODE_REPORT } from '@accounting/shared/enums/accounting.constants';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';
import {
  CODE_ESTADO,
  DOC_TYPE,
  DOC_TYPE_SRI,
  REPORT_FORMAT,
} from '@core/constants/global.constants';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId, isValidField } from '@core/utils/utils';
import { CuentaPorCobrarUseCase } from '@accounting/cuenta-por-cobrar/application/cuenta-por-cobrar.use-case';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { MatDivider } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Button, DynamicCard } from '@acontplus/ng-components';

@Component({
  selector: 'app-cartera-cliente',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    CompanyCustomerSearchComponent,
    MatSelectModule,
    MatTabsModule,
    DynamicCard,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatDivider,
    Button,
  ],
  templateUrl: './cartera-cliente.component.html',
  styles: ``,
})
export class CarteraClienteComponent implements OnInit {
  private tS = inject(ToastrNotificationService);
  private sharedSvc = inject(SharedService);
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly _cuentaPorCobrarUseCase = inject(CuentaPorCobrarUseCase);

  isSelectedNotaEntrega = false;
  dataSearch = {
    ckFecha: true,
    checkboxCompanyCustomer: false,
    ckCxcVencida: false,
    ckCuotas: false,
    codEstab: '',
    idPuntoEmision: 0,
    codEstado: 0 as string | number,
    codDoc: 0 as string | number,
    idEmpresa: 0,
    convertToDoc: false,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    companyCustomerId: 0,
    dirViviendaCliente: '',
    checkBoxDirViviendaCliente: false,
    idCiudad: 0,
    userId: 0,
  };

  establecimientos = signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  estadosDoc = signal<any[]>([]);
  tiposDoc = signal<any[]>([]);
  empresas = signal<any[]>([]);
  provinciasAgrupadas = signal<any[]>([]);
  users = signal<any[]>([]);

  format: any;

  getDataFilter() {
    this._cuentaPorCobrarUseCase.getDataFilter().subscribe((response) => {
      const { estabs, estadosDoc, tiposDoc, empresas, ciudades, users } = response;

      this.establecimientos.set(estabs);
      this.estadosDoc.set(estadosDoc);
      this.tiposDoc.set(tiposDoc);
      this.empresas.set(empresas);
      this.users.set(users);

      const provinciasAgrupadas = ciudades.reduce((agrupador: any, ciudad: any) => {
        const provinciaIndex = agrupador.findIndex((p: any) => p.nombre === ciudad.provincia);
        if (provinciaIndex >= 0) {
          agrupador[provinciaIndex].ciudades.push(ciudad);
        } else {
          agrupador.push({
            nombre: ciudad.provincia,
            ciudades: [ciudad],
          });
        }
        return agrupador;
      }, []);
      this.provinciasAgrupadas.set(provinciasAgrupadas);

      const dataEstab = this.establecimientos().find((estab) => estab.defaultEstab);
      this.puntosEmision.set(dataEstab?.puntosEmision ?? []);
      const dataPuntoEmision = this.puntosEmision().find((ptoEmi) => ptoEmi.defaultPtoEmi);
      this.dataSearch.codEstab = dataEstab?.codEstab ?? '';
      this.dataSearch.idPuntoEmision = dataPuntoEmision?.idPuntoEmision ?? 0;

      if (this.estadosDoc().length > 0) {
        this.dataSearch.codEstado = this.estadosDoc().find(
          (estado: any) => estado.codigo === CODE_ESTADO.NCBR,
        )?.codigo;
      }
    });
  }

  ngOnInit() {
    this.getDataFilter();
  }

  onChangeEstab() {
    const dataEstab = this.establecimientos().find(
      (estab) => estab.codEstab === this.dataSearch.codEstab,
    );
    this.puntosEmision.set(dataEstab?.puntosEmision ?? []);
    if (this.puntosEmision().length > 0) {
      this.dataSearch.idPuntoEmision =
        this.puntosEmision().find((pto) => pto.defaultPtoEmi)?.idPuntoEmision ?? 0;
    } else {
      this.tS.show({
        type: 'warning',
        message: 'No tienes asignados puntos de emisión!',
      });
      this.dataSearch.idPuntoEmision = 0;
    }
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  clearSearchCustomer() {
    this.dataSearch.companyCustomerId = 0;
  }
  onCustomerSelected(data: CompanyCustomerEntity) {
    this.dataSearch.companyCustomerId = data.idCliente;
  }

  onChangeTipoDoc() {
    this.isSelectedNotaEntrega = this.dataSearch.codDoc === DOC_TYPE.NE;
  }

  getReportPdf(tipo: number) {
    this.format = REPORT_FORMAT.PDF;
    if (tipo == 1) {
      this.getReport();
    }

    if (tipo == 2) {
      this.getReportDeudores();
    }
  }

  getReportExcel(tipo: number) {
    this.format = REPORT_FORMAT.EXCEL;
    this.getReport();
    if (tipo == 1) {
      this.getReport();
    }

    if (tipo == 2) {
      this.getReportDeudores();
    }
  }

  private getTipoDoc() {
    if (this.dataSearch.codDoc === DOC_TYPE.FV) {
      return DOC_TYPE_SRI.F;
    }
    return this.dataSearch.codDoc;
  }

  // Cartera Cliente
  private getReport() {
    if (this.dataSearch.checkboxCompanyCustomer && !getValidId(this.dataSearch.companyCustomerId)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Cliente',
      });
      return;
    }

    const idCliente = this.dataSearch.checkboxCompanyCustomer
      ? isValidField(this.dataSearch.companyCustomerId)
      : null;
    const idEmpresa = this.dataSearch.idEmpresa > 0 ? this.dataSearch.idEmpresa : null;

    const dirViviendaCliente = this.dataSearch.checkBoxDirViviendaCliente
      ? isValidField(this.dataSearch.dirViviendaCliente)
      : null;

    const dataParams = {
      tipo: 1,
      ckFecha: this.dataSearch.ckFecha,
      codEstab: this.dataSearch.codEstab,
      idCliente,
      codEstado: isValidField(this.dataSearch.codEstado),
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      ckCxcVencida: this.dataSearch.ckCxcVencida,
      ckCuotas: this.dataSearch.ckCuotas,
      codDoc: isValidField(this.getTipoDoc()),
      idEmpresa,
      convertToDoc: this.dataSearch.convertToDoc,
      dirViviendaCliente,
      userRoleId: this._tokenUseCase.getUserRoleId(),
      idCiudad: this.dataSearch.idCiudad,
      userId: this.dataSearch.userId,
    };

    const reportParams = JSON.stringify({
      // hasParams: false,
      codigo: this.dataSearch.ckCuotas ? ACCOUNTING_CODE_REPORT.CCCR : ACCOUNTING_CODE_REPORT.CCR,
      format: this.format,
      aditionalParams: [],
    });

    const parameters = {
      // hasIdUsuarioRol: true,
      reportParams,
      dataParams: JSON.stringify(dataParams),
      hasService: true,
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: this.format,
    });
  }

  // Deudores
  private getReportDeudores() {
    const dirViviendaCliente = this.dataSearch.checkBoxDirViviendaCliente
      ? isValidField(this.dataSearch.dirViviendaCliente)
      : null;

    const dataParams = {
      tipo: 7,
      codEstab: this.dataSearch.codEstab,
      ckCxcVencida: this.dataSearch.ckCxcVencida,
      dirViviendaCliente,
      userRoleId: this._tokenUseCase.getUserRoleId(),
      idCiudad: this.dataSearch.idCiudad,
    };

    const reportParams = JSON.stringify({
      // hasParams: false,
      codigo: 'RDEU',
      format: this.format,
      aditionalParams: [],
    });

    const parameters = {
      // hasIdUsuarioRol: true,
      reportParams,
      dataParams: JSON.stringify(dataParams),
      hasService: true,
    };

    this.sharedSvc.getReport({
      data: parameters,
      format: this.format,
    });
  }
}
