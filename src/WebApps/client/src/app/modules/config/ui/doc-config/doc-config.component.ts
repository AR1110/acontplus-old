import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {
  GroupedEstab,
  GroupedEstabPuntoEmision,
} from '@core/models/estab.model';
import { ToasterService } from '@core/services/toaster.service';

import { isValidField } from '@core/utils/utils';
import { DocConfig } from '@modules/config/domain/models/doc-config.model';
import { DocConfigService } from '@modules/config/services/doc-config.service';
import { ModalService } from '@core/services/modal.service';
import { DocConfigInfoAdicionalComponent } from '@modules/config/ui/doc-config/doc-config-info-adicional/doc-config-info-adicional.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-doc-config-page',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    MatCardContent,
    MatCard,
    MatInput,
    MatFormField,
    MatCheckbox,
    ThemeButtonComponent,
    MatSelect,
    MatOption,
    MatLabel,
  ],
  templateUrl: './doc-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocConfigPageComponent implements OnInit {
  private readonly _docConfigService = inject(DocConfigService);
  private readonly _tS = inject(ToasterService);
  private readonly _modalService = inject(ModalService);
  private readonly _cdr = inject(ChangeDetectorRef);

  establecimientos =signal<GroupedEstab[]>([]);
  puntosEmision = signal<GroupedEstabPuntoEmision[]>([]);
  docs = signal<DocConfig[]>([]);

  dataSearch = {
    idPuntoEmision: 0,
    codEstab: '',
  };

  getDocs() {
    this.docs.set([])
    this._docConfigService
      .getAll(this.dataSearch.idPuntoEmision)
      .subscribe((response) => {
        this.docs.set(response);
      });
  }

  ngOnInit() {
    this._docConfigService.getDataForm().subscribe((response) => {
      this.establecimientos.set(response.establecimientos);
      const dataEstab = this.establecimientos().find((e) => e.defaultEstab);
      if (dataEstab) {
        this.puntosEmision.set(dataEstab.puntosEmision);
        const dataPuntoEmision = this.puntosEmision().find(
          (p) => p.defaultPtoEmi,
        );
        if (dataPuntoEmision) {
          this.dataSearch.idPuntoEmision = dataPuntoEmision.idPuntoEmision;
          this.getDocs();
        }
        this.dataSearch.codEstab = dataEstab?.codEstab;
      }
      this._cdr.detectChanges();
    });
  }

  onChangeEstab() {
    const dataEstab = this.establecimientos().find(
      (e) => e.codEstab === this.dataSearch.codEstab,
    );
    if (dataEstab) {
      this.puntosEmision.set(dataEstab.puntosEmision);
      const dataPuntoEmision = this.puntosEmision().find((e) => e.defaultPtoEmi);
      if (dataPuntoEmision) {
        this.dataSearch.idPuntoEmision = dataPuntoEmision?.idPuntoEmision;
        this.getDocs();
      } else {
        this.dataSearch.idPuntoEmision = 0;
      }
    }
  }

  saveConfig(item: DocConfig) {
    if (!(this.dataSearch.idPuntoEmision > 0)) {
      this._tS.toastr({
        type: 'warning',
        message: 'Seleccione el punto de emisión',
      });
      return;
    }
    if (!isValidField(item.ultimaSecuencia)) {
      this._tS.toastr({
        type: 'warning',
        message: 'Seleccione el punto de emisión',
      });
      return;
    }

    const data = {
      idConfiguracionDocumento: item.idConfiguracionDocumento,
      idPuntoEmision: this.dataSearch.idPuntoEmision,
      idTipoDocumento: item.idTipoDocumento,
      estado: item.estado,
      ultimaSecuencia: item.ultimaSecuencia,
    };

    this._docConfigService.post(data).subscribe((response) => {
        this._tS.toastr({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          this.getDocs();
        }
    });
  }

  openModalInfoAdicional(data: DocConfig) {
    const modalRef = this._modalService.open(DocConfigInfoAdicionalComponent, {
      size: 'lg',
    });

    const params = {
      ...structuredClone(data),
      idPuntoEmision: this.dataSearch.idPuntoEmision,
    };
    modalRef.componentInstance.params = structuredClone(params);

    modalRef.result.then((result) => {
      if (result && typeof result === 'object') {
        this.getDocs();
      }
    });
  }
}
