import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';

import { EstablishmentService } from '@modules/config/services/sri/establishment.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { MatRadioModule } from '@angular/material/radio';
import { isValidEmail, isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { SEPARATOR_KEY_CODE } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { forkJoin, Observable } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-estab-add-edit-modal',
    imports: [
        CommonModule,
        FormsModule,
        MatIcon,
        MatChipsModule,
        MatRadioModule,
        ToUpperCaseDirective,
        MatButton,
        ThemeButtonComponent,
    ],
  templateUrl: './estab-add-edit-modal.component.html',
  styles: ``,
})
export class EstabAddEditModalComponent {
  @Input() params = {
    id: 0,
  };

  modal = inject(NgbActiveModal);
  private estabSvc = inject(EstablishmentService);
  private tS = inject(ToasterService);
  announcer = inject(LiveAnnouncer);

  titleModal = 'Nuevo Establecimiento';
  btnText = 'Guardar';

  cantones: any[] = [];
  actividadesEconomica: any[] = [];
  agentesRetencion: any[] = [];
  contribuyentes: any[] = [];
  ambientes: any[] = [];

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

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: string[] = [];
  telephones: string[] = [];

  successResponse = {
    next: (response: any) => {
      if (isApiResponse(response)) {
        if (response.code == '0') {
          this.tS.toastr({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code == '1') {
          this.tS.toastr({
            type: 'success',
            message: response.message,
          });
          this.modal.close(response);
        }
      }
    },
  };

  private getOnLoadData(): Observable<any> {
    if (this.params.id > 0) {
      this.titleModal = 'Editar Establecimiento';
      this.btnText = 'Actualizar';

      return forkJoin([
        this.estabSvc.getDataForm(),
        this.estabSvc.getId(this.params.id),
      ]);
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

        const {
          cantones,
          actividadesEconomica,
          agentesRetencion,
          contribuyentes,
          ambientes,
        } = mainDataForm;
        this.cantones = cantones;
        this.actividadesEconomica = actividadesEconomica;
        this.agentesRetencion = agentesRetencion;
        this.contribuyentes = contribuyentes;
        this.ambientes = ambientes;

        if (this.params.id > 0) {
          this.data = data;

          this.emails = data.emails;
          this.telephones = data.telephones;
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
    let dataInfo = this.contribuyentes.find(
      (item) => item.codigo === this.data.contribuyente,
    );
    if (!this.data.contribuyente || !dataInfo.contribuyenteRimpe) return;

    Swal.fire({
      icon: 'info',
      html: `<small>${dataInfo.contribuyenteRimpe}</small>`,
    });
  }

  showInfoActividadEconomica() {
    if (!this.data.actividad) return;
    const groupActEconomica = this.actividadesEconomica.find(
      (item) => item.codigo === this.data.actividad,
    ).grupo;
    Swal.fire({
      icon: 'info',
      html: `<small>${groupActEconomica}</small>`,
    });
  }

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.emails.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeEmail(value: string): void {
    const index = this.emails.indexOf(value);

    if (index >= 0) {
      this.emails.splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }
  }

  editEmail(email: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove email if it no longer has a name
    if (!value) {
      this.removeEmail(email);
      return;
    }

    // Edit existing email
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails[index] = value;
    }
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.telephones.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTelephone(value: string): void {
    const index = this.telephones.indexOf(value);

    if (index >= 0) {
      this.telephones.splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }
  }

  editTelephone(telefono: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.removeTelephone(telefono);
      return;
    }

    // Edit existing fruit
    const index = this.telephones.indexOf(telefono);
    if (index >= 0) {
      this.telephones[index] = value;
    }
  }

  async save() {
    try {
      if (!isValidField(this.data.nombreComercial)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese Nombre Comercial',
        });
        return;
      }

      if (!isValidField(this.data.estab)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese Nro. de Establecimiento',
        });
        return;
      }

      if (isNaN(parseFloat(this.data.estab))) {
        this.tS.toastr({
          type: 'warning',
          message: 'Nro. Establecimiento tiene que ser número',
        });
        return;
      }

      if (isValidField(this.data.estab) && this.data.estab?.length !== 3) {
        this.tS.toastr({
          type: 'warning',
          message: 'El Nro. de Establecimiento tiene que tener tres dígitos',
        });
        return;
      }

      if (!isValidField(this.data.contribuyente)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Tipo Contribuyente',
        });
        return;
      }

      if (isValidField(this.data.contribuyenteEspecial)) {
        if (isNaN(parseFloat(this.data.estab))) {
          this.tS.toastr({
            type: 'warning',
            message: 'Nro. Contribuyente Especial tiene que ser número',
          });
          return;
        }
        if (
          isValidField(this.data.contribuyenteEspecial) &&
          this.data.contribuyenteEspecial?.length !== 3
        ) {
          this.tS.toastr({
            type: 'warning',
            message: 'El Nro. de Establecimiento tiene que tener tres dígitos',
          });
          return;
        }
      }

      if (!isValidField(this.data.actividad)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione la Actividad',
        });
        return;
      }

      if (this.emails.length > 0) {
        if (!this.emails.every((item) => isValidEmail(item))) {
          this.tS.toastr({
            type: 'warning',
            message: 'Verifique que los correos  esten ingresado correctamente',
          });
          return;
        }
      }

      if (!isValidField(this.data.canton)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Seleccione el Cantón',
        });
        return;
      }

      if (!isValidField(this.data.dirEstablecimiento)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese la Dirección',
        });
        return;
      }

      this.data.contribuyenteRimpe = this.contribuyentes.find(
        (item) => item.codigo === this.data.contribuyente,
      ).contribuyenteRimpe;

      this.data.telefono =
        this.telephones.length > 0
          ? this.telephones.join(SEPARATOR_KEY_CODE.SLASH)
          : null;
      this.data.correo =
        this.emails.length > 0
          ? this.emails.join(SEPARATOR_KEY_CODE.SLASH)
          : null;

      if (!isValidField(this.data.correo)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Correo es requerido',
        });
        return;
      }
      if (!isValidField(this.data.telefono)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Teléfono es requerido',
        });
        return;
      }

      if (!(this.params.id > 0)) {
        this.estabSvc.post(this.data).subscribe(this.successResponse);
      }

      if (this.params.id > 0) {
        this.estabSvc
          .put(this.params.id, this.data)
          .subscribe(this.successResponse);
      }
    } catch (error) {
      console.trace(error);
    }
  }
}
