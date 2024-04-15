import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubEntidadFinancieraComponent } from './components/sub-entidad-financiera/sub-entidad-financiera.component';
import { ValorAbonoComponent } from './components/valor-abono/valor-abono.component';
import { FechaEmisionComponent } from './components/fecha-emision/fecha-emision.component';
import { BancoSelectComponent } from './components/banco-select/banco-select.component';

@Component({
  selector: 'app-forma-cobro-modal',
  standalone: true,
  imports: [
    NgbAccordionModule,
    FormsModule,
    SubEntidadFinancieraComponent,
    ValorAbonoComponent,
    FechaEmisionComponent,
    BancoSelectComponent
  ],
  templateUrl: './forma-cobro-modal.component.html',
  styles: ``
})
export class FormaCobroModalComponent {
  @Input() params = {
    dataFormaCobro: {} as any,
    comprobante: {
      razonSocialComprador: null
    },
    saldo: 0,
    datosCobro: []
  }

  modal = inject(NgbActiveModal);
  tS = inject(ToasterService)

  VALOR_ABONO_ORIGINAL = 0;

  data = {
    posFechado: false,
    idEntidadFinanciera: 0,
    idSubEntidadFinanciera: 0,
    valorAbono: 0,
    idBanco: 0,
    idCiudad: 0,
    referencia: null,
    nro: null,
    lote: null,
    aprobacion: null,
    fechaEmision: new Date()
  }

  comprobante = {
    razonSocialComprador: null
  }

  entidadesFinanciera: any[] = [];
  subEntidadesFinanciera: any[] = []
  bancos:any[] = []
  ciudades:any[] = []
  documentosElectronicos = [];

  selectedDocElectronico = []

  selectedIndexTab = 0;

  loadInitialData() {
    try {
      let { documentos, entidadesFinanciera, bancos, ciudades } = this.params.dataFormaCobro;
      this.comprobante = this.params.comprobante;
      this.entidadesFinanciera = entidadesFinanciera;


      this.bancos = bancos;
      this.ciudades = ciudades;

      this.documentosElectronicos = documentos;
    //  this.onChangeTabEntidadFinanciera(selectedIndexTab)
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit() {
    this.loadInitialData()
  }

  onChangeTabEntidadFinanciera($index:number) {

    try {
      const { descripcion, idEntidadFinanciera, codigo, subEntidadesFinanciera } = this.entidadesFinanciera.at($index);
      const el = document.getElementById('btnAddFormaPago');

      // Controlar la visibilidad del botón en función del código de la entidad financiera
      if (el) {
        el.style.display = codigo === 'DOC' ? 'none' : 'block';
      }

      this.subEntidadesFinanciera = subEntidadesFinanciera;
      this.data.idEntidadFinanciera = idEntidadFinanciera;

      // Establecer valores predeterminados para ciertos campos
      this.data.valorAbono = this.VALOR_ABONO_ORIGINAL;
      this.data.idBanco = 0;
      this.data.idCiudad = 0;
      this.data.referencia = codigo === 'CHE' ? this.comprobante.razonSocialComprador : null;
      this.data.nro = null;
      this.data.lote = null;
      this.data.aprobacion = null;
      this.data.posFechado = false;
      this.selectedDocElectronico = [];
      this.data.fechaEmision = new Date();

      if (this.subEntidadesFinanciera.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: `${descripcion}: No tiene SubEntidad Financiera creada`
        });
      } else {
        this.data.idSubEntidadFinanciera = this.subEntidadesFinanciera[0].idSubEntidadFinanciera;
      }

    } catch (error) {
      console.log(error);
    }
  }


}
