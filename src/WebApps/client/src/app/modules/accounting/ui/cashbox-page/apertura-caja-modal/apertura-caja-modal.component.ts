import { Component, Input, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ToasterService } from '@core/services/toaster.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIcon } from '@angular/material/icon';
import { EntidadFinanciera } from '@accounting/core/models/entidad-financiera.interface';
import { ControlCajaUseCase } from '@accounting/core/use-cases/control-caja.use-case';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-apertura-caja-modal',
    imports: [FormsModule, ReactiveFormsModule, MatIcon, MatButton, ThemeButtonComponent],
  templateUrl: './apertura-caja-modal.component.html',
})
export class AperturaCajaModalComponent {
  private activeModal = inject(NgbActiveModal);
  private _controlCajaUseCase = inject(ControlCajaUseCase);
  private tS = inject(ToasterService);

  @Input() params = {
    idCaja: 0,
  };

  entidadesFinanciera: Array<EntidadFinanciera> = [];

  dataForm = new FormGroup({
    idCaja: new FormControl(0),
    idEntidadFinanciera: new FormControl(0, Validators.required),
    concepto: new FormControl('', Validators.required),
    entrada: new FormControl(0, Validators.required),
  });

  ngOnInit() {
    this.dataForm.get('idCaja')?.setValue(this.params.idCaja);

    this._controlCajaUseCase.getDataForm().subscribe((response) => {
      let { formaPagos } = response as { formaPagos: any };
      this.entidadesFinanciera = formaPagos;
    });
  }

  save() {
    try {
      let data = this.dataForm.value;

      if (this.dataForm.invalid) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }
      if (
        !(
          typeof data.idEntidadFinanciera == 'number' &&
          data.idEntidadFinanciera > 0
        )
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!',
        });
        return;
      }

      if (data.idCaja && data.idCaja > 0) {
        this._controlCajaUseCase.post(data).subscribe((response) => {
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
            this.activeModal.close(response);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  onModalClose() {
    this.activeModal.close();
  }
}
