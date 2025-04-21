import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { isValidEmail, isValidField } from '@core/utils/utils';
import { ToasterService } from '@core/services/toaster.service';
import { CompanyService } from '@modules/config/services/company.service';
import { isApiResponse } from '@core/models/api-response';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-company-add-edit-modal',
    imports: [
        FormsModule,
        MatIcon,
        NgbTooltipModule,
        ToUpperCaseDirective,
        MatTooltip,
        MatButton,
        ThemeButtonComponent,
    ],
  templateUrl: './company-add-edit-modal.component.html',
  styles: ``,
})
export class CompanyAddEditModalComponent {
  @Input({ required: true }) params = {} as any;
  modal = inject(NgbActiveModal);
  tS = inject(ToasterService);
  companySvc = inject(CompanyService);

  data = {
    direccion: null as string | null,
    nombreComercial: null as string | null,
    razonSocial: null as string | null,
    ruc: null as string | null,
    email: null as string | null,
    telefono: null as string | null,
  };

  ngOnInit() {
    this.data = structuredClone(this.params);
  }

  save() {
    if (!isValidField(this.data.ruc)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese número de ruc',
      });
      return;
    }

    if (this.data.ruc?.slice(this.data.ruc?.length - 3) !== '001') {
      this.tS.toastr({
        type: 'warning',
        message: 'Número de RUC tiene que contener (001) en últimos dígitos',
      });
      return;
    }

    if (!isValidField(this.data.razonSocial)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese Razón Social',
      });
      return;
    }

    if (!isValidField(this.data.nombreComercial)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese Nombre Comercial',
      });
      return;
    }

    if (isValidField(this.data.email)) {
      if (!isValidEmail(this.data.email || '')) {
        this.tS.toastr({
          type: 'warning',
          message: 'Correo inválido!',
        });
        return;
      }
    }

    let params = {
      razonSocial: this.data.razonSocial,
      ruc: this.data.ruc,
      nombreComercial: this.data.nombreComercial,
      telefono: isValidField(this.data.telefono),
      //estado: true,
      email: isValidField(this.data.email),
      direccion: isValidField(this.data.direccion),
      //  idCiudad: 111
    };

    this.companySvc.put(this.params.idEntidad, params).subscribe((response) => {
      if (isApiResponse(response)) {
        if (response.code === '0') {
          this.tS.toastr({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code === '1') {
          this.tS.toastr({
            type: 'success',
            message: response.message,
          });
          this.modal.close(response);
        }
      }
    });
  }
}
