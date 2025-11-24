import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import Swal from 'sweetalert2';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { MatRadioModule } from '@angular/material/radio';
import { isValidEmail, isValidField } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { forkJoin, Observable } from 'rxjs';
import { MatIconButton } from '@angular/material/button';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { InputChip } from '@acontplus/ng-components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-estab-add-edit-modal',
  imports: [
    FormsModule,
    MatRadioModule,
    ToUpperCaseDirective,
    Button,
    MatCustomDialogComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconButton,
    MatIcon,
    InputChip,
  ],
  templateUrl: './estab-add-edit-modal.component.html',
  styles: ``,
})
export class EstabAddEditModalComponent implements OnInit {
  params = inject<{
    id: 0;
  }>(MAT_DIALOG_DATA);

  modal = inject(MatDialogRef<EstabAddEditModalComponent>);
  private estabSvc = inject(EstablishmentService);
  private tS = inject(ToastrNotificationService);

  titleModal = 'Nuevo Establecimiento';
  btnText = 'Guardar';

  cantones = signal<any[]>([]);
  actividadesEconomica = signal<any[]>([]);
  agentesRetencion = signal<any[]>([]);
  contribuyentes = signal<any[]>([]);
  ambientes = signal<any[]>([]);

  data = {
    canton: null,
    actividad: null,
    agenteRetencion: null,
    contribuyente: null,
    estab: '',
    contribuyenteEspecial: '',
    obligadoContabilidad: 'NO',
    nombreComercial: null,
    dirEstablecimiento: null,
    contribuyenteRimpe: null,
    telefono: null as string | null,
    correo: null as string | null,
  };

  isDisabledAgenteRetencion = false;

  emails = signal<string[]>([]);
  telephones = signal<string[]>([]);

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code == '0') {
      this.tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code == '1') {
      this.tS.show({
        type: 'success',
        message: response.message,
      });
      this.modal.close(response);
    }
  };

  private getOnLoadData(): Observable<any> {
    if (this.params.id > 0) {
      this.titleModal = 'Editar Establecimiento';
      this.btnText = 'Actualizar';

      return forkJoin([this.estabSvc.getDataForm(), this.estabSvc.getId(this.params.id)]);
    }

    return this.estabSvc.getDataForm();
  }

  ngOnInit() {
    try {
      this.getOnLoadData().subscribe((response) => {
        let mainDataForm = {} as any;
        let data = {} as any;

        if (Array.isArray(response)) {
          mainDataForm = response[0];
          data = response[1].data;
        } else {
          mainDataForm = response;
        }

        const { cantones, actividadesEconomica, agentesRetencion, contribuyentes, ambientes } =
          mainDataForm;
        this.cantones.set(cantones);
        this.actividadesEconomica.set(actividadesEconomica);
        this.agentesRetencion.set(agentesRetencion);
        this.contribuyentes.set(contribuyentes);
        this.ambientes.set(ambientes);

        if (this.params.id > 0) {
          this.data = data;

          this.emails.set(data.emails);
          this.telephones.set(data.telephones);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onChangeTipoContribuyente() {
    this.isDisabledAgenteRetencion = this.data.contribuyente == '03';
    if (this.isDisabledAgenteRetencion) {
      this.data.agenteRetencion = null;
    }
  }

  showInfoTipoContribuyente() {
    const dataInfo = this.contribuyentes().find((item) => item.codigo === this.data.contribuyente);
    if (!this.data.contribuyente || !dataInfo.contribuyenteRimpe) return;

    Swal.fire({
      icon: 'info',
      html: `<small>${dataInfo.contribuyenteRimpe}</small>`,
    });
  }

  showInfoActividadEconomica() {
    if (!this.data.actividad) return;
    const groupActEconomica = this.actividadesEconomica().find(
      (item) => item.codigo === this.data.actividad,
    ).grupo;
    Swal.fire({
      icon: 'info',
      html: `<small>${groupActEconomica}</small>`,
    });
  }

  async save() {
    try {
      if (!isValidField(this.data.nombreComercial)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese Nombre Comercial',
        });
        return;
      }

      if (!isValidField(this.data.estab)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese Nro. de Establecimiento',
        });
        return;
      }

      if (isNaN(parseFloat(this.data.estab))) {
        this.tS.show({
          type: 'warning',
          message: 'Nro. Establecimiento tiene que ser número',
        });
        return;
      }

      if (isValidField(this.data.estab) && this.data.estab?.length !== 3) {
        this.tS.show({
          type: 'warning',
          message: 'El Nro. de Establecimiento tiene que tener tres dígitos',
        });
        return;
      }

      if (!isValidField(this.data.contribuyente)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Tipo Contribuyente',
        });
        return;
      }

      if (isValidField(this.data.contribuyenteEspecial)) {
        if (isNaN(parseFloat(this.data.estab))) {
          this.tS.show({
            type: 'warning',
            message: 'Nro. Contribuyente Especial tiene que ser número',
          });
          return;
        }
        if (
          isValidField(this.data.contribuyenteEspecial) &&
          this.data.contribuyenteEspecial?.length !== 3
        ) {
          this.tS.show({
            type: 'warning',
            message: 'El Nro. de Establecimiento tiene que tener tres dígitos',
          });
          return;
        }
      }

      if (!isValidField(this.data.actividad)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione la Actividad',
        });
        return;
      }

      if (this.emails.length > 0) {
        if (!this.emails().every((item) => isValidEmail(item))) {
          this.tS.show({
            type: 'warning',
            message: 'Verifique que los correos  esten ingresado correctamente',
          });
          return;
        }
      }

      if (!isValidField(this.data.canton)) {
        this.tS.show({
          type: 'warning',
          message: 'Seleccione el Cantón',
        });
        return;
      }

      if (!isValidField(this.data.dirEstablecimiento)) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese la Dirección',
        });
        return;
      }

      this.data.contribuyenteRimpe = this.contribuyentes().find(
        (item) => item.codigo === this.data.contribuyente,
      ).contribuyenteRimpe;

      this.data.telefono =
        this.telephones().length > 0 ? this.telephones().join(SEPARATOR_KEY_CODE.SLASH) : null;
      this.data.correo =
        this.emails().length > 0 ? this.emails().join(SEPARATOR_KEY_CODE.SLASH) : null;

      if (!isValidField(this.data.correo)) {
        this.tS.show({
          type: 'warning',
          message: 'Correo es requerido',
        });
        return;
      }
      if (!isValidField(this.data.telefono)) {
        this.tS.show({
          type: 'warning',
          message: 'Teléfono es requerido',
        });
        return;
      }

      if (!(this.params.id > 0)) {
        this.estabSvc.post(this.data).subscribe(this.successResponse);
      }

      if (this.params.id > 0) {
        this.estabSvc.put(this.params.id, this.data).subscribe(this.successResponse);
      }
    } catch (error) {
      console.trace(error);
    }
  }
  close() {
    this.modal.close();
  }
}
