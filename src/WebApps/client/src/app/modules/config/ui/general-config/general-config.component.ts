import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DynamicCard } from '@acontplus/ng-components';
import { MatTabsModule } from '@angular/material/tabs';
import { ListGeneralConfigUseCase } from '@modules/config/application/use-cases/general-config/list-general-config.use-case';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { InputChip } from '@acontplus/ng-components';
import { MatSelectModule } from '@angular/material/select';
import { Button } from '@acontplus/ng-components';
import { FormsModule } from '@angular/forms';
import { isValidEmail, isValidField } from '@core/utils/utils';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import Swal from 'sweetalert2';
import { UpdateGeneralConfigUseCase } from '@modules/config/application/use-cases/general-config/update-general-config.use-case';
import { DecimalSelectComponent } from '@modules/config/ui/general-config/decimal-select/decimal-select.component';
import { MatListModule } from '@angular/material/list';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { ProductSearchComponent } from '@inventory/ui/product/components/product-search/product-search.component';
import { CompanyCustomerEntity } from '@company-customer/domain/entities/company-customer.entity';

@Component({
  selector: 'app-general-config',
  imports: [
    MatTabsModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
    DynamicCard,
    MatListModule,
    CompanyCustomerSearchComponent,
    ProductSearchComponent,
    DecimalSelectComponent,
    BreadcrumbComponent,
    DynamicCard,
    InputChip,
    Button,
  ],
  templateUrl: './general-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralConfigComponent implements OnInit {
  private $listUseCase = inject(ListGeneralConfigUseCase);
  private $updateUseCase = inject(UpdateGeneralConfigUseCase);
  CODE_TABS = {
    CV: 'CV',
    CI: 'CI',
    CD: 'CD',
    CS: 'CS',
  };

  selectedTab = signal(0);
  selectedTabValue = signal(this.CODE_TABS.CV);

  notificacionesSelected: any[] = [];

  private readonly decimal = {
    nroPrecio: 5,
    nroCantidad: 2,
    nroIva: 5,
    nroDescuento: 3,
    nroDescuentoDetalle: 4,
    nroTotalDetalle: 2,
    nroTotalSubTotal: 3,
    nroIce: 3,
    importeTotal: 2,
  };

  decimalVenta = structuredClone(this.decimal);

  decimalCompra = structuredClone(this.decimal);

  decimalAlmacen = {
    idSistema: 0,
    nroPrecio: 2,
  };

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
    configCc: false,
    cc: undefined as any,
    tipoConfig: '' as any,
    interes: 0 as any,
    idSistema: 0,
    razonSocialComprador: '',
    nombreArticulo: '',
    diasGracia: null as null | number,
  };
  emails: string[] = [];

  //Inventario
  configInventario = {
    idMetodoValoracion: 0,
    llevaInventario: false,
    idSistema: 0,
  };
  metodosValoracion: any[] = [];

  productSearchProps = {
    isSimpleMode: true,
  };

  //Notificaciones
  notificaciones = signal<any[]>([]);

  formasPagoSri = signal<any[]>([]);

  private getList() {
    this.$listUseCase.execute(this.selectedTabValue()).subscribe((response) => {
      switch (this.selectedTabValue()) {
        case this.CODE_TABS.CV:
          this.configVenta = response.configVenta;
          this.formasPagoSri.set(response.formasPagoSri);
          this.emails = this.configVenta.cc;
          break;

        case this.CODE_TABS.CI:
          this.configInventario = response.configInventario;
          this.metodosValoracion = response.metodosValoracion;
          break;

        case this.CODE_TABS.CD:
          this.decimalAlmacen = response.decimalAlmacen;
          this.decimalVenta = response.decimalVenta;
          this.decimalCompra = response.decimalCompra;
          break;

        case this.CODE_TABS.CS:
          this.notificaciones.set(response.notificaciones);
          this.notificacionesSelected = this.notificaciones().filter((item) => item.estado);
          break;
        default:
          break;
      }
    });
  }

  ngOnInit() {
    this.getList();
  }

  selectedIndexChange($event: any) {
    const obj: Record<any, any> = {
      0: this.CODE_TABS.CV,
      1: this.CODE_TABS.CI,
      2: this.CODE_TABS.CD,
      3: this.CODE_TABS.CS,
    };
    this.selectedTab.set($event);
    this.selectedTabValue.set(obj[$event]);
    this.getList();
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

  ngModelChangeNotifi($event: any) {
    this.notificacionesSelected = $event;
  }

  selectedCustomer($event: CompanyCustomerEntity) {
    // console.log($event)
    this.configVenta.idCliente = $event.idCliente;
    this.configVenta.razonSocialComprador = $event.nombreFiscal;
  }

  clearSearchCustomer() {
    this.configVenta.idCliente = 0;
    this.configVenta.razonSocialComprador = '';
  }

  productSelected($event: any) {
    const data = $event.data;
    this.configVenta.idArticulo = data.idArticulo;
    this.configVenta.nombreArticulo = data.descripcion;
  }
  emptyInputProduct() {
    this.configVenta.idArticulo = 0;
  }

  save() {
    let jsonConfig = {} as any;
    let data = {} as any;

    //---------------------------------Configuracion de Ventas---------------------------
    if (this.selectedTabValue() === this.CODE_TABS.CV) {
      if (this.configVenta.customerDefault) {
        if (!(this.configVenta.idCliente > 0)) {
          Swal.fire({
            icon: 'warning',
            text: 'Seleccione un Cliente',
          });
          return;
        } else {
          jsonConfig.idCliente = this.configVenta.idCliente;
        }
      }
      if (this.configVenta.articleDefault) {
        if (!(this.configVenta.idArticulo > 0)) {
          Swal.fire({
            icon: 'warning',
            text: 'Selecione un Articulo',
          });
          return;
        } else {
          jsonConfig.idArticulo = this.configVenta.idArticulo;
        }
      }

      if (this.configVenta.configDeuda) {
        if (!isValidField(this.configVenta.tipoConfig)) {
          Swal.fire({
            icon: 'warning',
            text: 'Seleccione El tipo de Configuración de Interes',
          });
          return;
        }

        if (!(this.configVenta.interes > 0)) {
          Swal.fire({
            icon: 'warning',
            text: ' Ingrese el valor del Interes',
          });

          return;
        }
      } else {
        this.configVenta.tipoConfig = undefined;
        this.configVenta.interes = undefined;
      }

      if (this.configVenta.configCc) {
        if (this.emails.length === 0) {
          Swal.fire({
            icon: 'warning',
            text: 'Ingrese al menos un correo!',
          });
          return;
        }
        if (!this.emails.every((e) => isValidEmail(e))) {
          Swal.fire({
            icon: 'warning',
            text: 'Verifique que los correos esten en formato correcto',
          });
          return;
        }
      }

      jsonConfig.searchCode = this.configVenta.searchCode;
      jsonConfig.printerAutomatic = this.configVenta.printerAutomatic;
      jsonConfig.payAutomatic = this.configVenta.payAutomatic;
      jsonConfig.configInteres = this.configVenta.configDeuda;
      jsonConfig.cc = this.configVenta.configCc ? this.emails.join(SEPARATOR_KEY_CODE.SLASH) : null;
      jsonConfig.multipleVendedor = this.configVenta.multipleVendedor;
      jsonConfig.detailDuplicate = this.configVenta.detailDuplicate;
      jsonConfig.idFormaPagoSri =
        this.configVenta.idFormaPagoSri > 0 ? this.configVenta.idFormaPagoSri : undefined;
      jsonConfig.infoInteres = {
        tipoConfig: this.configVenta.tipoConfig,
        interes: this.configVenta.interes,
        diasGracia: this.configVenta.diasGracia,
      };

      data = {
        idSistema: this.configVenta.idSistema,
        jsonConfig,
      };
    }

    //---------------------------------Configuracion de Inventario---------------------------
    if (this.selectedTabValue() === this.CODE_TABS.CI) {
      if (this.configInventario.llevaInventario) {
        if (!(this.configInventario.idMetodoValoracion > 0)) {
          Swal.fire({
            icon: 'warning',
            text: 'Seleccione un Metodo de Valoración',
          });
          return;
        } else {
          jsonConfig = this.metodosValoracion.find(
            (item) => item.idMetodoValoracion === this.configInventario.idMetodoValoracion,
          );
        }
      } else {
        // jsonConfig.idMetodoValoracion = undefined;
        // jsonConfig.codMetodoValoracion = undefined;
      }

      jsonConfig.llevaInventario = this.configInventario.llevaInventario ? 'SI' : 'NO';

      data = {
        idSistema: this.configInventario.idSistema,
        jsonConfig,
      };
    }

    //---------------------------------Configuracion de Decimales---------------------------
    if (this.selectedTabValue() === this.CODE_TABS.CD) {
      jsonConfig = [this.decimalAlmacen, this.decimalCompra, this.decimalVenta];

      data = {
        idSistema: this.decimalAlmacen.idSistema,
        jsonConfig,
      };
    }

    //------------------------------Configuracion de Notificaciones------------------------
    if (this.selectedTabValue() === this.CODE_TABS.CS) {
      data = {
        idSistema: this.notificaciones()[0].idSistema,
        jsonConfig: this.notificaciones().map((item) => ({
          idNotificacionSistema: item.idNotificacionSistema,
          estado: this.notificacionesSelected.some(
            (n) => n.idNotificacionSistema === item.idNotificacionSistema,
          ),
          codigo: item.codigo,
        })),
      };
    }

    this.$updateUseCase.execute(data).subscribe((response) => {
      if (response.code === '0') {
        Swal.fire({
          icon: 'warning',
          text: response.message,
        });
      }

      if (response.code == '1') {
        Swal.fire({
          icon: 'success',
          text: response.message,
          timer: 1000,
        });
        setTimeout(() => {
          this.getList();
        }, 1000);
      }
    });
  }
}
