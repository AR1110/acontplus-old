import {
  INVENTORY_CODE_REPORT,
  REPORT_FORMAT,
  ReportFacade,
  ReportParamsBuilder,
} from '@acontplus/ng-common';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import {
  BreadcrumbComponent,
  DateRangeSelectionComponent,
  formatDateToString,
  getValidId,
  GroupedEstab,
  GroupedEstabBodega,
  isValidEmail,
  isValidField,
  SEPARADORES_REGEX,
  ToastrNotificationService,
} from '@core/index';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { Brand } from '@inventory/data/models/brand.model';
import { ProductSearchComponent } from '@inventory/ui/product/components/product-search/product-search.component';
import { SubCategoryGroup } from '@inventory/ui/sub-category/components/sub-category-group/sub-category-group';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import {
  ActionEnviarCorreoDirective,
  NotificacionService,
  UserRoleStateService,
  UserSearchComponent,
} from '@shared/index';
import Swal from 'sweetalert2';

const imports = [
  FormsModule,
  DynamicCard,
  MatTabsModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatDividerModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  NgTemplateOutlet,
  BreadcrumbComponent,
  SubCategoryGroup,
  ProductSearchComponent,
  DateRangeSelectionComponent,
  SupplierSearchComponent,
  UserSearchComponent,
  CompanyCustomerSearchComponent,
  //Directives
  ActionEnviarCorreoDirective,
];

@Component({
  selector: 'app-inventory-report',
  imports: [imports, Button],
  templateUrl: './inventory-report.component.html',
  styles: ``,
})
export class InventoryReportComponent implements OnInit {
  private pS = inject(UserRoleStateService);
  private tS = inject(ToastrNotificationService);
  appNotifiSvc = inject(NotificacionService);
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly reportFacade = inject(ReportFacade);

  private readonly _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);
  protected readonly FORMAT_REPORT = REPORT_FORMAT;

  isReporting = false;
  isSendingEmail = false;

  estabs: GroupedEstab[] = [];
  bodegas: GroupedEstabBodega[] = [];
  subCategories: any[] = [];
  marcas: Brand[] = [];
  taxes = signal<any[]>([]);

  correoReceptor = null as string | null | undefined;

  dataSearch = {
    idEstablecimiento: 0,
    idBodega: 0,
    idSubFamilia: 0,
    checkboxArticuloFiltro: false,
    checkboxPrecioCostoFiltro: false,
    checkboxUsuarioFiltro: false,
    checkboxAgruparArticulo: false,
    checkboxSubCategoryFilter: false,
    idArticulo: 0,
    idUsuario: 0,
    chkProveedor: false,
    numeroIdentificacion: null as null | string,
    checkboxSubFamiliaFiltro: false,
    checkboxStockFiltro: false,
    byStock: 0,
    timePicker: false,
    chkUbicacion: false,
    textUbicacion: null as string | null,
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
    idMarca: 0,
    ckFechaCaducidad: false,
    ckFechaModificaccion: true,
    byTipoReporte: 0,
    expiredStatusCode: 'VI',
    tipoReporteStock: INVENTORY_CODE_REPORT.STOCK_VALORACION,
    stockStatusCode: 0,
    checkboxCompanyCustomer: false,
    checkboxObtenerRentabilidad: false,
    idTarifa: 0,
    idTipoIva: 0,
    checkboxSupplier: false,
    nameSupplier: '',
  };

  expirationStates = [
    { code: 'CA', description: 'Caducado' },
    { code: 'PA', description: 'Próximo a Caducar' },
    { code: 'VI', description: 'Vigente' },
  ];

  stockStatus = [
    { code: 0, description: 'Todos' },
    { code: 'CS', description: 'Con stock' },
    { code: 'SS', description: 'Sin stock' },
    { code: 'SM', description: 'Stock mínimo' },
  ];

  tarifas: any[] = [];

  selected = new FormControl(0);

  private format: REPORT_FORMAT.PDF | REPORT_FORMAT.EXCEL | null = null;

  tiposDoc = signal<any[]>([]);
  tiposDocSelected = new FormControl([]);

  getDatFormReport() {
    this._PRODUCT_SERVICE.getDataReport().subscribe((response) => {
      const { estabs, subCategorias, marcas } = response;
      this.estabs = estabs;
      this.subCategories = subCategorias;
      this.marcas = marcas;
      this.tarifas = response.tarifas;
      this.taxes.set(response.taxes);
      this.tiposDoc.set(response.tiposDoc);
      const dataEstab = this.estabs.find((e) => e.defaultEstab);

      if (dataEstab) {
        this.correoReceptor = dataEstab.correo;
        this.dataSearch.idEstablecimiento = dataEstab.idEstablecimiento;
        this.bodegas = dataEstab.bodegas;
        this.dataSearch.idBodega = this.bodegas.find((item) => item.defaultBodega)?.idBodega ?? 0;
      }
    });
  }

  ngOnInit() {
    this.getDatFormReport();
    this.pS.getAction().subscribe((res) => {
      this.isReporting = res?.reporte;
      this.isSendingEmail = res?.enviarCorreo;
    });
  }

  onNavChange($event: any) {
    this.selected.setValue($event);
    this.dataSearch.checkboxArticuloFiltro = false;
    this.dataSearch.checkboxUsuarioFiltro = false;
    this.dataSearch.chkProveedor = false;
    this.dataSearch.checkboxSubFamiliaFiltro = false;
    this.dataSearch.ckFechaCaducidad = false;
    this.dataSearch.chkUbicacion = false;

    this.dataSearch.fromDate = formatDateToString(new Date());
    this.dataSearch.toDate = formatDateToString(new Date());
  }

  onChangeEstab() {
    if (this.estabs.length === 0) return;
    if (!(this.dataSearch.idEstablecimiento > 0)) {
      this.dataSearch.idBodega = 0;
      this.dataSearch.idEstablecimiento = 0;
      this.bodegas = [];
      this.correoReceptor = this._tokenUseCase.getUserData()?.email;
      return;
    }
    const dataEstab = this.estabs.find(
      (item) => item.idEstablecimiento === this.dataSearch.idEstablecimiento,
    );
    this.bodegas = dataEstab?.bodegas ?? [];
    if (this.bodegas.length > 0) {
      this.dataSearch.idBodega = this.bodegas.find((item) => item.defaultBodega)?.idBodega ?? 0;
    } else {
      this.dataSearch.idBodega = 0;
    }
  }

  // onChangeTipoTransaccion(){
  //   this.dataSearch.checkboxSupplier = false;
  //   this.dataSearch.checkboxCompanyCustomer = false;
  // }
  onSelectedSubCategory(id: number) {
    this.dataSearch.idSubFamilia = id;
  }

  onEmptyDataSubCategory() {
    this.dataSearch.idSubFamilia = 0;
  }

  onProductSelected({ data }: any) {
    this.dataSearch.idArticulo = data.idArticulo;
  }

  onEmtyDataProduct(event: any) {
    this.dataSearch.idArticulo = 0;
  }

  onUserSelected(data: any) {
    this.dataSearch.idUsuario = data.idUsuario;
  }

  onEmptyInputUserSearch() {
    this.dataSearch.idUsuario = 0;
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }

  onSupplierSelected(data: any) {
    // this.dataSearch.idProveedor = infrastructure.idProveedor;
    this.dataSearch.numeroIdentificacion = data.identificacionComprador;
    this.dataSearch.nameSupplier = data.name;
  }

  supplierclearSearch($event: any) {
    this.dataSearch.numeroIdentificacion = null;
  }

  onChangeCheckProveedor() {
    if (this.dataSearch.chkProveedor) {
      this.dataSearch.checkboxSubFamiliaFiltro = false;
    }
  }

  clearSearchCustomer() {
    //this.dataSearch.companyCustomerId = 0;
    this.dataSearch.numeroIdentificacion = null;
  }
  onCustomerSelected(data: CompanyCustomerEntity) {
    this.dataSearch.numeroIdentificacion = data.numeroIdentificacion;
  }

  private getFilterDate() {
    const fechaHoy = new Date();
    const fecha =
      fechaHoy.getDate() + '-' + (fechaHoy.getMonth() + 1) + '-' + fechaHoy.getFullYear();
    const hora = fechaHoy.getHours() + ':' + fechaHoy.getMinutes();
    return fecha + ' ' + hora;
  }

  private getSelectedTab() {
    return (this.selected.value || 0) + 1;
  }

  private isValidReport() {
    const selectedTab = this.getSelectedTab();
    if (this.dataSearch.checkboxArticuloFiltro) {
      if (!(this.dataSearch.idArticulo > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Artículo!',
        });
        return;
      }
      if (this.dataSearch.checkboxUsuarioFiltro) {
        if (!(this.dataSearch.idUsuario > 0)) {
          this.tS.show({
            type: 'warning',
            message: 'Seleccione el Usuario!',
          });
          return;
        }
      }
    }

    if (this.dataSearch.chkProveedor) {
      if (!this.dataSearch.numeroIdentificacion) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Proveedor!',
        });
        return;
      }
    }

    if (!this.dataSearch.chkProveedor && this.dataSearch.checkboxSubFamiliaFiltro) {
      if (!this.dataSearch.idSubFamilia) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la SubFamilia',
        });
        return;
      }
    }

    if (this.dataSearch.checkboxStockFiltro) {
      if (!this.dataSearch.byStock) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Stock',
        });
        return;
      }
    }

    if (this.dataSearch.checkboxUsuarioFiltro) {
      if (!(this.dataSearch.idUsuario > 0)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Usuario',
        });
        return;
      }
    }

    if (selectedTab === 3) {
      if (this.dataSearch.chkUbicacion) {
        if (!this.dataSearch.textUbicacion) {
          this.tS.show({
            type: 'warning',
            message: 'Ingrese la ubicación ',
          });
          return;
        }
      }
    }
    return true;
  }

  getReportPDF() {
    this.format = REPORT_FORMAT.PDF;
    this.getReport();
  }

  getReportExcel() {
    this.format = REPORT_FORMAT.EXCEL;
    this.getReport();
  }

  getReport() {
    const selectedTab = this.getSelectedTab();

    if (!this.isValidReport()) return;

    if (selectedTab === 1) {
      this.getReportConsumoDiario();
    }

    if (selectedTab === 2) {
      if (this.dataSearch.checkboxObtenerRentabilidad) {
        if (!getValidId(this.dataSearch.idTarifa)) {
          this.tS.show({
            type: 'warning',
            message: 'La Tarifa es obligatorio',
          });
          return;
        }
        this.getArticuloStockRentabilidad();
      } else {
        this.getReportArticuloStock();
      }
    }
    if (selectedTab === 3) {
      this.getReportArticuloPVP();
    }
    if (selectedTab === 4) {
      this.getReportArticuloFraccionado();
    }
    if (selectedTab === 5) {
      this.getReportCaducidad();
    }
  }

  private getCodEstab() {
    const dataEstab = this.estabs.find(
      (e) => e.idEstablecimiento === this.dataSearch.idEstablecimiento,
    );
    if (dataEstab) {
      return dataEstab.codEstab;
    }
    return null;
  }

  private getDataParamsConsumoDiario() {
    const idSubFamilia = this.dataSearch.checkboxSubCategoryFilter
      ? isValidField(this.dataSearch.idSubFamilia)
      : null;

    let numeroIdentificacion = null as string | null;
    if (this.dataSearch.checkboxCompanyCustomer) {
      numeroIdentificacion = isValidField(this.dataSearch.numeroIdentificacion);
    }

    if (this.dataSearch.checkboxSupplier) {
      numeroIdentificacion = isValidField(this.dataSearch.numeroIdentificacion);
    }

    const idUsuario = this.dataSearch.checkboxUsuarioFiltro
      ? isValidField(this.dataSearch.idUsuario)
      : null;
    const idArticulo = this.dataSearch.checkboxArticuloFiltro
      ? isValidField(this.dataSearch.idArticulo)
      : null;
    const tiposDocSelected =
      Array.isArray(this.tiposDocSelected.value) && this.tiposDocSelected.value.join(',');

    return {
      tipo: 4,
      checkBoxFecha: true,
      checkboxPrecioCostoFiltro: this.dataSearch.checkboxPrecioCostoFiltro,
      idUsuario,
      idArticulo,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      codEstab: this.getCodEstab() ?? undefined,
      idBodega: isValidField(this.dataSearch.idBodega),
      idSubFamilia,
      numeroIdentificacion,
      userRoleId: this._tokenUseCase.getUserRoleId(),
      tiposDocSelected: tiposDocSelected || null,
      timePicker: this.dataSearch.timePicker,
    };
  }
  // REPORTE DE CONSUMO DIARIO DE ARTICULOS
  private getReportConsumoDiario() {
    const reportOptions = ReportParamsBuilder.build({
      codeReport: this.dataSearch.checkboxAgruparArticulo
        ? INVENTORY_CODE_REPORT.CDAA
        : INVENTORY_CODE_REPORT.CDA,
      data: this.getDataParamsConsumoDiario(),
      format: this.format!,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }

  getReportArticuloStock() {
    const filtroFecha = this.getFilterDate();

    const idSubFamilia = this.dataSearch.checkboxSubCategoryFilter
      ? isValidField(this.dataSearch.idSubFamilia)
      : null;
    const numeroIdentificacion = this.dataSearch.chkProveedor
      ? isValidField(this.dataSearch.numeroIdentificacion)
      : null;

    const dataSearch = {
      tipo: 3,
      bySubFamilia: idSubFamilia,
      numeroIdentificacion,
      codEstab: this.getCodEstab() ?? undefined,
      idBodega: isValidField(this.dataSearch.idBodega),
      idMarca: isValidField(this.dataSearch.idMarca),
      filtroFecha,
      stockStatusCode:
        this.dataSearch.stockStatusCode === 0
          ? null
          : isValidField(this.dataSearch.stockStatusCode),
      userRoleId: this._tokenUseCase.getUserRoleId(),
      idTipoIva: getValidId(this.dataSearch.idTipoIva),
    };

    const reportOptions = ReportParamsBuilder.build({
      codeReport: INVENTORY_CODE_REPORT.STOCK_VALORACION,
      data: dataSearch,
      format: this.format!,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }

  private getArticuloStockRentabilidad() {
    const filtroFecha = this.getFilterDate();

    const idSubFamilia = this.dataSearch.checkboxSubCategoryFilter
      ? isValidField(this.dataSearch.idSubFamilia)
      : null;
    const numeroIdentificacion = this.dataSearch.chkProveedor
      ? isValidField(this.dataSearch.numeroIdentificacion)
      : null;

    const dataSearch = {
      tipo: 6,
      bySubFamilia: idSubFamilia,
      numeroIdentificacion,
      codEstab: this.getCodEstab() ?? undefined,
      idBodega: isValidField(this.dataSearch.idBodega),
      idMarca: isValidField(this.dataSearch.idMarca),
      idTarifa: getValidId(this.dataSearch.idTarifa),
      filtroFecha,
      stockStatusCode:
        this.dataSearch.stockStatusCode === 0
          ? null
          : isValidField(this.dataSearch.stockStatusCode),
      userRoleId: this._tokenUseCase.getUserRoleId(),
      idTipoIva: getValidId(this.dataSearch.idTipoIva),
    };

    const reportOptions = ReportParamsBuilder.build({
      codeReport: INVENTORY_CODE_REPORT.RASR,
      data: dataSearch,
      format: this.format!,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }

  getReportArticuloPVP() {
    const bySubFamilia = this.dataSearch.checkboxSubCategoryFilter
      ? isValidField(this.dataSearch.idSubFamilia)
      : null;

    const dataSearch = {
      tipo: 2,
      bySubFamilia,
      stockStatusCode:
        this.dataSearch.stockStatusCode === 0
          ? null
          : isValidField(this.dataSearch.stockStatusCode),
      idTarifa: getValidId(this.dataSearch.idTarifa),
      idMarca: isValidField(this.dataSearch.idMarca),
      userRoleId: this._tokenUseCase.getUserRoleId(),
      ckFechaModificaccion: this.dataSearch.ckFechaModificaccion,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      idTipoIva: getValidId(this.dataSearch.idTipoIva),
    };

    const reportOptions = ReportParamsBuilder.build({
      codeReport: INVENTORY_CODE_REPORT.ARTICULO_PVP,
      data: dataSearch,
      format: this.format!,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }

  // REPORTE DE ARTICULOS FRACCIONADOS
  getReportArticuloFraccionado() {
    const numeroIdentificacion = this.dataSearch.chkProveedor
      ? isValidField(this.dataSearch.numeroIdentificacion)
      : null;

    const idSubFamilia = this.dataSearch.checkboxSubFamiliaFiltro
      ? isValidField(this.dataSearch.idSubFamilia)
      : null;

    const dataSearch = {
      tipo: 1,
      checkBoxArticulo: this.dataSearch.checkboxArticuloFiltro,
      idArticulo: this.dataSearch.idArticulo,
      chkProveedor: this.dataSearch.chkProveedor,
      numeroIdentificacion,
      checkboxSubFamiliaFiltro: this.dataSearch.checkboxSubFamiliaFiltro,
      bySubFamilia: idSubFamilia,
      userRoleId: this._tokenUseCase.getUserRoleId(),
    };
    const reportOptions = ReportParamsBuilder.build({
      codeReport: INVENTORY_CODE_REPORT.RAF,
      data: dataSearch,
      format: this.format!,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }

  // REPORTE DE CADUCIDAD DE ARTICULOS
  getReportCaducidad() {
    const filtroFecha = this.getFilterDate();
    const dataSearch = {
      tipo: 5,
      codEstab: this.getCodEstab() ?? undefined,
      chkProveedor: this.dataSearch.chkProveedor,
      numeroIdentificacion: this.dataSearch.numeroIdentificacion,
      checkboxSubFamiliaFiltro: this.dataSearch.checkboxSubFamiliaFiltro,
      bySubFamilia: this.dataSearch.idSubFamilia,
      ckFechaCaducidad: this.dataSearch.ckFechaCaducidad,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      chkUbicacion: this.dataSearch.chkUbicacion,
      idBodega: isValidField(this.dataSearch.idBodega),
      textUbicacion: this.dataSearch.textUbicacion,
      chkEstado: true,
      //estado: this.dataSearch.estado,
      byTipoFormato: this.format,
      byTipoReporte: this.dataSearch.byTipoReporte,
      filtroFecha,
      userRoleId: this._tokenUseCase.getUserRoleId(),
    };
    const reportOptions = ReportParamsBuilder.build({
      codeReport: INVENTORY_CODE_REPORT.RCAA,
      data: dataSearch,
      format: this.format!,
    });
    this.reportFacade.open(reportOptions).subscribe();
  }

  async askToSendMail() {
    const correos = this.correoReceptor?.split(SEPARADORES_REGEX) || [];
    if (!isValidField(this.correoReceptor)) {
      Swal.fire({
        icon: 'warning',
        text: 'El establecimiento o la Entidad no tiene agregado el correo',
      });
      return;
    }

    // Validar formato de cada correo
    const correosInvalidos = correos.filter((correo) => !isValidEmail(correo.trim()));

    if (correosInvalidos.length > 0) {
      Swal.fire({
        icon: 'warning',
        text: `Formato incorrecto en los siguientes correos:\n${correosInvalidos.join(', ')}`,
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Confirmación',
      icon: 'warning',
      html: `
        <p>¿Deseas <strong>enviar el reporte</strong> al correo electrónico asignado al establecimiento?</p>
        <p>Esta acción enviará la información automáticamente.</p>
      `,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      reverseButtons: true, // Pone Cancelar a la izquierda, más común en UX
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    const params = {
      subject: 'Reporte Consumo Diario',
      params: {
        hasFile: true,
        isReport: 'SI',
        reportParams: {
          hasParams: false,
          codigo: this.dataSearch.checkboxAgruparArticulo
            ? INVENTORY_CODE_REPORT.CDAA
            : INVENTORY_CODE_REPORT.CDA,
          format: REPORT_FORMAT.PDF,
        },
        spParams: this.getDataParamsConsumoDiario(),
        //  withTableNames: true,
      },
      receptor: this.correoReceptor,
    };

    this.appNotifiSvc.post(params).subscribe((response) => {
      if (response.code === '0') {
        Swal.fire({
          icon: 'warning',
          text: response.message,
        });
      }
      if (response.code === '1') {
        Swal.fire({
          icon: 'success',
          text: response.message,
        });
      }
    });
  }
}
