import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { isApiResponse } from "@core/models/api-response";
import { GroupedEstab, GroupedEstabPuntoEmision } from "@core/models/estab.model";
import { ToasterService } from "@core/services/toaster.service";
import { hideLoader, showLoader } from "@core/utils/loader";
import { isValidField } from "@core/utils/utils";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DocConfig } from "@modules/config/models/doc-config.model";
import { DocConfigService } from "@modules/config/services/doc-config.service";
import { ModalService } from "@core/services/modal.service";
import { DocConfigInfoAdicionalComponent } from "./components/doc-config-info-adicional/doc-config-info-adicional.component";

@Component({
  selector: 'app-doc-config-page',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    BreadcrumbComponent
  ],
  templateUrl: './doc-config.component.html'
})
export class DocConfigPageComponent {
  private docConfigSvc = inject(DocConfigService);
  private tS = inject(ToasterService);
  private modalSvc = inject(ModalService);

  establecimientos: Array<GroupedEstab> = [];
  puntosEmision: Array<GroupedEstabPuntoEmision> = [];
  docs: Array<DocConfig> = [];

  dataSearch = {
    idPuntoEmision: 0,
    codEstab: ''
  }

  getDocs() {
    showLoader();
    this.docConfigSvc.getAll(this.dataSearch.idPuntoEmision).subscribe({
      next: (response) => {
        this.docs = response;
        hideLoader();
      },
      error(err) {
        console.log(err)
        hideLoader();
      },
    })
  }

  ngOnInit() {

    showLoader();
    this.docConfigSvc.getDataForm().subscribe({
      next: (response) => {
        hideLoader();
        this.establecimientos = response.establecimientos;
        let dataEstab = this.establecimientos.find(e => e.defaultEstab);
        if (dataEstab) {
          this.puntosEmision = dataEstab?.puntosEmision;
          let dataPuntoEmision = this.puntosEmision.find(p => p.defaultPtoEmi);
          if (dataPuntoEmision) {
            this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
            this.getDocs();
          }
          this.dataSearch.codEstab = dataEstab?.codEstab;
        }
      },
      error(err) {
        console.log(err)
        hideLoader()
      },
    })
  }

  onChangeEstab() {
    let dataEstab = this.establecimientos.find(e => e.codEstab === this.dataSearch.codEstab);
    if (dataEstab) {
      this.puntosEmision = dataEstab.puntosEmision;
      let dataPuntoEmision = this.puntosEmision.find(e => e.defaultPtoEmi);
      if (dataPuntoEmision) {
        this.dataSearch.idPuntoEmision = dataPuntoEmision?.idPuntoEmision;
        this.getDocs()
      } else {
        this.dataSearch.idPuntoEmision = 0;
      }
    }
  }


  saveConfig(item: DocConfig) {
    if (!(this.dataSearch.idPuntoEmision > 0)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el punto de emisión'
      })
      return;
    }
    if (!isValidField(item.ultimaSecuencia)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione el punto de emisión'
      })
      return;
    }

    const data = {
      idConfiguracionDocumento: item.idConfiguracionDocumento,
      idPuntoEmision: this.dataSearch.idPuntoEmision,
      idTipoDocumento: item.idTipoDocumento,
      estado: item.estado,
      ultimaSecuencia: item.ultimaSecuencia
    };

    showLoader();
    this.docConfigSvc.post(data).subscribe({
      next: (response) => {
        hideLoader()
        if (isApiResponse(response)) {
          if (response.code === "0") {
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code === "1") {
            this.tS.toastr({
              type: 'success',
              message: response.message
            })
            this.getDocs();
          }
        }
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
    })
  };

  openModalInfoAdicional(data: DocConfig) {
    let modalRef = this.modalSvc.open(DocConfigInfoAdicionalComponent, {
       size: 'lg' ,
      })

      let params = {
        ...structuredClone(data),
          idPuntoEmision:  this.dataSearch.idPuntoEmision
      }
      modalRef.componentInstance.params = structuredClone(params)

    modalRef.result.then(result => {
      if (result && typeof result === 'object') {
        this.getDocs()
      }
    })
  }


}
