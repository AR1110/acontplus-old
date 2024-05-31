
import { Component, inject } from "@angular/core";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import {NgbAccordionModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import { DecimalSelectComponent } from "./components/decimal-select/decimal-select.component";
import { GeneralConfigService } from "@modules/config/services/general-config.service";
import { FormsModule } from "@angular/forms";
import { ToasterService } from "@core/services/toaster.service";
import { isApiResponse } from "@core/models/api-response";
import { ProductSearchComponent } from '@modules/inventory/components/product/product-search/product-search.component';
import { CompanyCustomerSearchComponent } from "@modules/customer/company-customer/components/company-customer-search/company-customer-search.component";
import {isValidEmail, isValidField} from "@core/utils/utils";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {InputChipComponent} from "@shared/components/input-chip/input-chip.component";
import {SEPARATOR_KEY_CODE} from "@core/constants/global.constants";

@Component({
  selector: 'app-general-config',
  standalone: true,
  imports: [
    FormsModule,
    NgbAccordionModule,
    NgbTooltipModule,
    BreadcrumbComponent,
    DecimalSelectComponent,
    FontAwesomeModule,
    ProductSearchComponent,
    CompanyCustomerSearchComponent,
    InputChipComponent,
  ],
  templateUrl: './general-config.component.html'
})

export class GeneralConfigComponent {

  private generalConfigSvc = inject(GeneralConfigService);
  private tS = inject(ToasterService)

  formasPagoSri: Array<any> = [];
  CODE_TABS = {
    CV: 'CV',
    CI: 'CI',
    CD: 'CD',
    CS: 'CS'
  }

  mainDataForm = {
    codeTab: this.CODE_TABS.CV
  }

  private readonly decimal = {
    nroPrecio: 5,
    nroCantidad: 2,
    nroIva: 5,
    nroDescuento: 3,
    nroDescuentoDetalle: 4,
    nroTotalDetalle: 2,
    nroTotalSubTotal: 3,
    nroIce: 3,
    importeTotal: 2
  }

  decimalVenta = structuredClone(this.decimal)

  decimalCompra = structuredClone(this.decimal);

  decimalAlmacen = {
    idSistema: 0,
    nroPrecio: 2
  }

  configVenta = {
    customerDefault: false,
    idFormaPagoSri: 0,
    articleDefault: false,
    searchCode: false,
    printerAutomatic: false,
    payAutomatic: false,
    multipleVendedor: false,
    detailDuplicate: false,
    idCliente: 0,
    idArticulo: 0,
    configDeuda: false,
    configCc : false,
    cc : undefined as  any,
    tipoConfig: "" as any,
    interes: 0 as any,
    idSistema: 0,
    razonSocialComprador: '',
    nombreArticulo: ''
  }
  emails: string[] = []

  //Inventario
  configInventario = {
    idMetodoValoracion: 0,
    llevaInventario: false,
    idSistema: 0
  };
  metodosValoracion: Array<any> = [];

  productSearchProps = {
    isSearchSimple: true
  }

  //Notificaciones
  notificaciones: Array<any> = [];

  getDataTabs() {
    this.emails = []
    this.generalConfigSvc.getData(this.mainDataForm.codeTab).subscribe( (response) => {

        switch (this.mainDataForm.codeTab) {
          case this.CODE_TABS.CV:
            this.configVenta = response.configVenta;
            this.formasPagoSri = response.formasPagoSri;
            this.emails = this.configVenta.cc;
            break;

          case this.CODE_TABS.CI:
            this.configInventario = response.configInventario;
            this.metodosValoracion = response.metodosValoracion;
            break;

          case this.CODE_TABS.CD:
            console.log(response)
            this.decimalAlmacen = response.decimalAlmacen;
            this.decimalVenta = response.decimalVenta;
            this.decimalCompra = response.decimalCompra;
            break;

          case this.CODE_TABS.CS:
            this.notificaciones = response.notificaciones;
            break;
          default:
            break;
        }
    })
  }

  showAcordeon(codeTab: string) {
    this.mainDataForm.codeTab = codeTab;
    this.getDataTabs();
  }

  ngOnInit() {
    // this.getDataTabs();
  }

  onProductSelected(event: any) {
    let data = event.data;
    this.configVenta.idArticulo = data.idArticulo;
  }
  productResultEmptyInput(data: any) {
    this.configVenta.idArticulo = 0;
  }

  onCustomerSelected<T extends { data: any }>($event: T) {
    let { data } = $event;
    this.configVenta.idCliente = data.idCliente;
    this.configVenta.razonSocialComprador = data.razonSocialComprador;
  }

  resultCustomerEmptyInput($event: any) {
    this.configVenta.idCliente = 0;
  }


  tipoConfigPI = true;
  tipoConfigPF = false;
  onChangeConfigPorcentaje() {
    if (this.configVenta.tipoConfig == 'PI') {
      this.tipoConfigPI = true;
      this.tipoConfigPF = false;
    }
    if (this.configVenta.tipoConfig == 'PF') {
      this.tipoConfigPI = false;
      this.tipoConfigPF = true;
    }
  }

  save() {

    let jsonConfig = {

    } as any
    let data = {} as any



    //---------------------------------Configuracion de Ventas---------------------------
    if (this.mainDataForm.codeTab === this.CODE_TABS.CV) {

      if (this.configVenta.customerDefault) {
        if (!(this.configVenta.idCliente > 0)) {
          this.tS.toastr({
            type: 'warning',
            message: 'Seleccione un Cliente'
          })
          return
        } else {
          jsonConfig.idCliente = this.configVenta.idCliente;
        }
      }
      if (this.configVenta.articleDefault) {
        if (!(this.configVenta.idArticulo > 0)) {
          this.tS.toastr({
            type: 'warning',
            message: 'Selecione un Articulo'
          })
          return
        } else {
          jsonConfig.idArticulo = this.configVenta.idArticulo;
        }
      }


      if (this.configVenta.configDeuda) {
        if (!isValidField(this.configVenta.tipoConfig)) {
          this.tS.toastr({
            type: 'warning',
            message: 'Seleccione El tipo de Configuración de Interes'
          })
          return
        }

        if (!(this.configVenta.interes > 0)) {
          this.tS.toastr({
            type: 'warning',
            message: ' Ingrese el valor del Interes'
          })
          return
        }

      } else {
        this.configVenta.tipoConfig = undefined;
        this.configVenta.interes = undefined;
      }

      if(this.configVenta.configCc){
        if(this.emails.length===0){
          this.tS.toastr({
            type: 'warning',
            message: 'Ingrese al menos un correo!'
          })
          return
        }
        if(!this.emails.every(e=>isValidEmail(e))){
          this.tS.toastr({
            type: 'warning',
            message: 'Verifique que los correos esten en formato correcto'
          })
          return
        }
      }


      jsonConfig.searchCode = this.configVenta.searchCode;
      jsonConfig.printerAutomatic = this.configVenta.printerAutomatic;
      jsonConfig.payAutomatic = this.configVenta.payAutomatic;
      jsonConfig.configInteres = this.configVenta.configDeuda;
      jsonConfig.cc            = this.configVenta.configCc? this.emails.join(SEPARATOR_KEY_CODE.SLASH) : null;
      jsonConfig.multipleVendedor = this.configVenta.multipleVendedor;
      jsonConfig.detailDuplicate = this.configVenta.detailDuplicate;
      jsonConfig.idFormaPagoSri = this.configVenta.idFormaPagoSri > 0 ? this.configVenta.idFormaPagoSri : undefined
      jsonConfig.infoInteres = {
        tipoConfig: this.configVenta.tipoConfig,
        interes: this.configVenta.interes,
      };

      data = {
        idSistema: this.configVenta.idSistema,
        jsonConfig
      }

    }


    //---------------------------------Configuracion de Inventario---------------------------
    if (this.mainDataForm.codeTab === this.CODE_TABS.CI) {
      if (this.configInventario.llevaInventario) {
        if (!(this.configInventario.idMetodoValoracion > 0)) {
          this.tS.toastr({
            type: 'warning',
            message: 'Seleccione un Metodo de Valoración'
          })
          return
        } else {
          jsonConfig = this.metodosValoracion.find(item => item.idMetodoValoracion === this.configInventario.idMetodoValoracion)
        }
      } else {
        // jsonConfig.idMetodoValoracion = undefined;
        // jsonConfig.codMetodoValoracion = undefined;
      }

      jsonConfig.llevaInventario = this.configInventario.llevaInventario ? 'SI' : 'NO';

      data = {
        idSistema: this.configInventario.idSistema,
        jsonConfig
      }
    }


    //---------------------------------Configuracion de Decimales---------------------------
    if (this.mainDataForm.codeTab === this.CODE_TABS.CD) {
      jsonConfig = [this.decimalAlmacen, this.decimalCompra, this.decimalVenta]

      data = {
        idSistema: this.decimalAlmacen.idSistema,
        jsonConfig
      }
    }

    //------------------------------Configuracion de Notificaciones------------------------
    if (this.mainDataForm.codeTab === this.CODE_TABS.CS) {
      data = {
        idSistema: this.notificaciones[0].idSistema,
        jsonConfig: this.notificaciones.map(item => ({
          idNotificacionSistema: item.idNotificacionSistema,
          estado: item.estado,
          codigo: item.codigo
        }))
      }
    }



    this.generalConfigSvc.put(data).subscribe( (response) => {
        if (isApiResponse(response)) {
          if (response.code === "0") {
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code == "1") {
            this.tS.toastr({
              type: 'success',
              message: response.message
            })

            this.getDataTabs();
          }
        }
    })




  }

}
