import { Component, inject } from '@angular/core';
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { ProductService } from "@inventory/services/product.service";
import { GroupedEstab, GroupedEstabBodega } from "@core/models/estab.model";
import { FormsModule } from "@angular/forms";
import { Brand } from "@inventory/models/brand.model";
import {
  SubCategoryGroupComponent
} from "@inventory/components/sub-category/sub-category-group/sub-category-group.component";
import { ProductSearchComponent } from "@inventory/components/product/product-search/product-search.component";
import { UserSearchComponent } from "@core/components/user-search/user-search.component";
import { DateRangeSelectionComponent } from "@core/components/date-range-selection/date-range-selection.component";
import { FORMAT_REPORT } from "@core/constants/global.constants";
import { ToasterService } from "@core/services/toaster.service";
import { formatDateMoment } from "@core/utils/format-date-moment";
import { getValidId, isValidField } from "@core/utils/utils";
import { INVENTORY_CODE_REPORT } from "@inventory/enums/inventory.enum";
import { SharedService } from "@core/services/shared.service";
import { SupplierSearchComponent } from "@purchase/components/supplier-search/supplier-search.component";
import {
  CompanyCustomerSearchComponent
} from "@company-customer/components/company-customer-search/company-customer-search.component";

@Component({
  selector: 'app-inventory-report-page',
  standalone: true,
  imports: [
    NgbNavModule,
    FormsModule,
    BreadcrumbComponent,
    SubCategoryGroupComponent,
    ProductSearchComponent,
    UserSearchComponent,
    DateRangeSelectionComponent,
    SupplierSearchComponent,
    CompanyCustomerSearchComponent,
  ],
  templateUrl: './inventory-report-page.component.html',
  styles: ``
})
export class InventoryReportPageComponent {
  productSvc = inject(ProductService)
  tS = inject(ToasterService)
  sharedSvc = inject(SharedService)

  activeTab = 1;

  estabs: GroupedEstab[] = [];
  bodegas: GroupedEstabBodega[] = []
  subCategories: any[] = []
  marcas: Brand[] = []

  dataSearch = {
    idEstablecimiento: 0,
    idBodega: 0,
    idSubFamilia: 0,
    checkboxArticuloFiltro: false,
    checkboxUsuarioFiltro: false,
    checkboxAgruparArticulo: false,
    checkboxSubCategoryFilter: false,
    idArticulo: 0,
    idUsuario: 0,
    codTransaccion: 'S',
    chkProveedor: false,
    numeroIdentificacion: null as null | string,
    checkboxSubFamiliaFiltro: false,
    checkboxStockFiltro: false,
    byStock: 0,
    chkUbicacion: false,
    textUbicacion: null as string | null,
    fromDate: formatDateMoment(new Date()),
    toDate: formatDateMoment(new Date()),
    idMarca: 0,
    ckFechaCaducidad: false,
    byTipoReporte: 0,
    expiredStatusCode: 'VI',
    tipoReporteStock: INVENTORY_CODE_REPORT.STOCK_VALORACION,
    stockStatusCode: null,
    checkboxCompanyCustomer: false,
    checkboxObtenerRentabilidad: false,
    idTarifa: 0
  }

  expirationStates = [
    { code: 'CA', description: 'Caducado' },
    { code: 'PA', description: 'Próximo a Caducar' },
    { code: 'VI', description: 'Vigente' },
  ]

  stockStatus = [
    { code: null, description: 'Todos' },
    { code: 'CS', description: 'Con stock' },
    { code: 'SS', description: 'Sin stock' },
    { code: 'SM', description: 'Stock mínimo' },
  ]

  tarifas: any[] = []

  private format: FORMAT_REPORT.PDF | FORMAT_REPORT.EXCEL | null = null;

  getDatFormReport() {
    this.productSvc.getDataReport().subscribe(response => {

      const { estabs, subCategorias, marcas } = response;
      this.estabs = estabs;
      this.subCategories = subCategorias;
      this.marcas = marcas;
      this.tarifas = response.tarifas;
      let dataEstab = this.estabs.find(e => e.defaultEstab);
      if (dataEstab) {
        this.dataSearch.idEstablecimiento = dataEstab.idEstablecimiento;
        this.bodegas = dataEstab.bodegas;
        this.dataSearch.idBodega = this.bodegas.find(item => (item.defaultBodega))?.idBodega ?? 0;
      }
    })
  }

  ngOnInit() {
    this.getDatFormReport()
  }

  onNavChange($event: any) {
    this.dataSearch.checkboxArticuloFiltro = false;
    this.dataSearch.checkboxUsuarioFiltro = false;
    this.dataSearch.chkProveedor = false;
    this.dataSearch.checkboxSubFamiliaFiltro = false;
    this.dataSearch.ckFechaCaducidad = false;
    this.dataSearch.chkUbicacion = false;

    this.dataSearch.fromDate = formatDateMoment(new Date())
    this.dataSearch.toDate = formatDateMoment(new Date());
  }

  onChangeEstab() {
    if (this.estabs.length === 0) return
    if (!(this.dataSearch.idEstablecimiento > 0)) {
      this.dataSearch.idBodega = 0;
      this.dataSearch.idEstablecimiento = 0;
      this.bodegas = [];
      return
    }
    let dataEstab = this.estabs.find(item => item.idEstablecimiento === this.dataSearch.idEstablecimiento);
    this.bodegas = dataEstab?.bodegas ?? []
    if (this.bodegas.length > 0) {
      this.dataSearch.idBodega = this.bodegas.find(item => (item.defaultBodega))?.idBodega ?? 0
    } else {
      this.dataSearch.idBodega = 0;

    }
  }


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


  onUserSelected({ data }: any) {
    this.dataSearch.idUsuario = data.idUsuario;
  }

  onEmptyInputUserSearch() {
    this.dataSearch.idUsuario = 0;
  }



  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
  }


  onSupplierSelected<T extends { data: any }>({ data }: T) {

    // this.dataSearch.idProveedor = data.idProveedor;
    this.dataSearch.numeroIdentificacion = data.numeroIdentificacion;
  }

  supplierResultEmptyInput($event: any) {
    this.dataSearch.numeroIdentificacion = null
  }

  onChangeCheckProveedor() {
    if (this.dataSearch.chkProveedor) {
      this.dataSearch.checkboxSubFamiliaFiltro = false;
    }
  }

  resultEmptyInputCustomer() {
    //this.dataSearch.companyCustomerId = 0;
    this.dataSearch.numeroIdentificacion = null;
  }
  onCustomerSelected({ data }: any) {
    this.dataSearch.numeroIdentificacion = data.identificacionComprador;

  }




  private getFilterDate() {
    let fechaHoy = new Date();
    let fecha = fechaHoy.getDate() + '-' + (fechaHoy.getMonth() + 1) + '-' + fechaHoy.getFullYear();
    let hora = fechaHoy.getHours() + ':' + fechaHoy.getMinutes();
    return fecha + ' ' + hora;
  }

  private isValidReport() {
    if (this.dataSearch.checkboxArticuloFiltro) {
      if (!(this.dataSearch.idArticulo > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Artículo!'
        });
        return
      }
      if (this.dataSearch.checkboxUsuarioFiltro) {
        if (!(this.dataSearch.idUsuario > 0)) {
          this.tS.toastr({
            type: 'warning',
            message: 'Seleccione el Usuario!'
          });
          return
        }
      }
    }


    if (this.dataSearch.chkProveedor) {
      if (!(this.dataSearch.numeroIdentificacion)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Proveedor!'
        });
        return
      }
    }

    if (!this.dataSearch.chkProveedor && this.dataSearch.checkboxSubFamiliaFiltro) {
      if (!this.dataSearch.idSubFamilia) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione la SubFamilia'
        });
        return
      }
    }

    if (this.dataSearch.checkboxStockFiltro) {
      if (!this.dataSearch.byStock) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Stock'
        });
        return
      }
    }

    if (this.dataSearch.checkboxUsuarioFiltro) {
      if (!(this.dataSearch.idUsuario > 0)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Usuario'
        });
        return;
      }
    }

    if (this.dataSearch.checkboxCompanyCustomer) {
      if (!isValidField(this.dataSearch.numeroIdentificacion)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el cliente'
        })
        return
      }
    }

    if (this.activeTab === 3) {
      if (this.dataSearch.chkUbicacion) {
        if (!this.dataSearch.textUbicacion) {
          this.tS.toastr({
            type: 'warning',
            message: 'Ingrese la ubicación '
          });
          return;
        }
      }
    }
    return true;
  }



  getReportPDF() {
    this.format = FORMAT_REPORT.PDF
    this.getReport()
  }

  getReportExcel() {
    this.format = FORMAT_REPORT.EXCEL
    this.getReport()
  }

  getReport() {

    if (!this.isValidReport()) return




    if (this.activeTab === 1) {
      this.getReportConsumoDiario();
    }

    if (this.activeTab === 2) {
      if (this.dataSearch.checkboxObtenerRentabilidad) {
        if (!getValidId(this.dataSearch.idTarifa)) {
          this.tS.toastr({
            type: 'warning',
            message: 'La Tarifa es obligatorio'
          })
          return
        }
        this.getArticuloStockRentabilidad();
      } else {
        this.getReportArticuloStock();
      }
    }
    if (this.activeTab === 3) {
      this.getReportArticuloPVP();
    }
    if (this.activeTab === 4) {
      this.getReportArticuloFraccionado();
    }
    if (this.activeTab === 5) {
      this.getReportCaducidad();
    }

  }

  private getCodEstab() {
    let dataEstab = this.estabs.find(e => e.idEstablecimiento === this.dataSearch.idEstablecimiento);
    if (dataEstab) {
      return dataEstab.codEstab;
    }
    return null;
  }

  // REPORTE DE CONSUMO DIARIO DE ARTICULOS
  private getReportConsumoDiario() {

    let idSubFamilia = this.dataSearch.checkboxSubCategoryFilter ? isValidField(this.dataSearch.idSubFamilia) : null;
    let numeroIdentificacion = this.dataSearch.checkboxCompanyCustomer ? isValidField(this.dataSearch.numeroIdentificacion) : null


    let dataSearch = {
      tipo: 4,
      checkBoxFecha: true,
      idUsuario: this.dataSearch.checkboxUsuarioFiltro ? isValidField(this.dataSearch.idUsuario) : null,
      idArticulo: this.dataSearch.checkboxArticuloFiltro ? isValidField(this.dataSearch.idArticulo) : null,
      codTransaccion: this.dataSearch.codTransaccion,
      fechaInicio: this.dataSearch.fromDate,
      fechaFin: this.dataSearch.toDate,
      codEstab: this.getCodEstab(),
      idBodega: isValidField(this.dataSearch.idBodega),
      idSubFamilia,
      numeroIdentificacion
    }

    const parameters = {
      reportParams: JSON.stringify({
        codigo: this.dataSearch.checkboxAgruparArticulo ? INVENTORY_CODE_REPORT.CDAA : INVENTORY_CODE_REPORT.CDA,
        format: this.format,
        aditionalParams: []
      }),
      dataParams: JSON.stringify(dataSearch)
    }


    this.sharedSvc.getReport({
      data: parameters,
      format: this.format!,
      isOldVersion: true
    })
  }


  getReportArticuloStock() {
    try {
      let filtroFecha = this.getFilterDate();

      let idSubFamilia = this.dataSearch.checkboxSubCategoryFilter ? isValidField(this.dataSearch.idSubFamilia) : null
      let numeroIdentificacion = this.dataSearch.chkProveedor ? isValidField(this.dataSearch.numeroIdentificacion) : null

      let dataSearch = {
        tipo: 3,
        bySubFamilia: idSubFamilia,
        numeroIdentificacion,
        codEstab: this.getCodEstab(),
        idBodega: isValidField(this.dataSearch.idBodega),
        idMarca: isValidField(this.dataSearch.idMarca),
        filtroFecha,
        stockStatusCode: isValidField(this.dataSearch.stockStatusCode)
      }

      const parameters = {
        reportParams: JSON.stringify({
          codigo: INVENTORY_CODE_REPORT.STOCK_VALORACION,
          format: this.format,
          aditionalParams: []
        }),
        dataParams: JSON.stringify(dataSearch)
      }

      this.sharedSvc.getReport({
        data: parameters,
        format: this.format!,
        isOldVersion: true
      })
    } catch (error) {
      console.log(error)
    }
  }


  private getArticuloStockRentabilidad() {
    try {
      let filtroFecha = this.getFilterDate();

      let idSubFamilia = this.dataSearch.checkboxSubCategoryFilter ? isValidField(this.dataSearch.idSubFamilia) : null;
      let numeroIdentificacion = this.dataSearch.chkProveedor ? isValidField(this.dataSearch.numeroIdentificacion) : null;

      let dataSearch = {
        tipo: 6,
        bySubFamilia: idSubFamilia,
        numeroIdentificacion,
        codEstab: this.getCodEstab(),
        idBodega: isValidField(this.dataSearch.idBodega),
        idMarca: isValidField(this.dataSearch.idMarca),
        idTarifa: getValidId(this.dataSearch.idTarifa),
        filtroFecha,
        stockStatusCode: isValidField(this.dataSearch.stockStatusCode)
      }

      const parameters = {
        reportParams: JSON.stringify({
          codigo: INVENTORY_CODE_REPORT.RASR,
          format: this.format,
          aditionalParams: []
        }),
        dataParams: JSON.stringify(dataSearch)
      }

      this.sharedSvc.getReport({
        data: parameters,
        format: this.format!,
        isOldVersion: true
      })
    } catch (error) {
      console.log(error)
    }


  }


  getReportArticuloPVP() {
    try {

      let bySubFamilia = this.dataSearch.checkboxSubCategoryFilter ? isValidField(this.dataSearch.idSubFamilia) : null

      let dataSearch = {
        tipo: 2,
        bySubFamilia,
        stockStatusCode: isValidField(this.dataSearch.stockStatusCode),
        idTarifa: getValidId(this.dataSearch.idTarifa),
        idMarca: isValidField(this.dataSearch.idMarca),
      }
      const parameters = {
        reportParams: JSON.stringify({
          codigo: INVENTORY_CODE_REPORT.ARTICULO_PVP,
          format: this.format,
          aditionalParams: []
        }),
        dataParams: JSON.stringify(dataSearch)
      }

      this.sharedSvc.getReport({
        data: parameters,
        format: this.format!,
        isOldVersion: true
      })
    } catch (error) {
      console.log(error)
    }
  }


  // REPORTE DE ARTICULOS FRACCIONADOS
  getReportArticuloFraccionado() {
    let numeroIdentificacion = this.dataSearch.chkProveedor ? isValidField(this.dataSearch.numeroIdentificacion) : null

    let idSubFamilia = this.dataSearch.checkboxSubFamiliaFiltro ? isValidField(this.dataSearch.idSubFamilia) : null


    let dataSearch = {
      tipo: 1,
      checkBoxArticulo: this.dataSearch.checkboxArticuloFiltro,
      idArticulo: this.dataSearch.idArticulo,
      chkProveedor: this.dataSearch.chkProveedor,
      numeroIdentificacion,
      checkboxSubFamiliaFiltro: this.dataSearch.checkboxSubFamiliaFiltro,
      bySubFamilia: idSubFamilia,
    }
    const parameters = {
      reportParams: JSON.stringify({
        codigo: INVENTORY_CODE_REPORT.RAF,
        format: this.format,
        aditionalParams: []
      }),
      dataParams: JSON.stringify(dataSearch)
    }
    this.sharedSvc.getReport({
      data: parameters,
      format: this.format!,
      isOldVersion: true
    })
  }

  // REPORTE DE CADUCIDAD DE ARTICULOS
  getReportCaducidad() {
    let filtroFecha = this.getFilterDate();
    let dataSearch = {
      tipo: 5,
      codEstab: this.getCodEstab(),
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
      filtroFecha
    }

    const parameters = {
      reportParams: JSON.stringify({
        codigo: INVENTORY_CODE_REPORT.RCAA,
        format: this.format,
        aditionalParams: []
      }),
      dataParams: JSON.stringify(dataSearch)
    }

    this.sharedSvc.getReport({
      data: parameters,
      format: this.format!,
      isOldVersion: true
    })
  }









}
