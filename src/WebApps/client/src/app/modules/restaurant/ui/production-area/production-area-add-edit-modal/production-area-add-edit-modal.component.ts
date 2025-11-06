import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ProductionArea } from '@restaurant/domain/models/production-area';
import { ProductionAreaService } from '@restaurant/data/services/production-area.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';

import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';

@Component({
  selector: 'app-production-area-add-edit-modal',
  imports: [ReactiveFormsModule, MatSlideToggle, MatCustomDialogComponent, ThemeButtonComponent],
  templateUrl: './production-area-add-edit-modal.component.html',
  styles: ``,
})
export class ProductionAreaAddEditModalComponent implements OnInit {
  establecimientoId = 0;
  data = inject<ProductionArea>(MAT_DIALOG_DATA);
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  productionAreaForm = new FormGroup({
    id: new FormControl(0),
    establecimientoId: new FormControl(0, [Validators.required]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    enabled: new FormControl(true),
  });
  modalIcon = 'add';
  modalTitle = 'Registrar Área de Producción';
  #modalRef = inject(MatDialogRef<ProductionAreaAddEditModalComponent>);
  #productionAreaService = inject(ProductionAreaService);
  #sharedService = inject(SharedService);
  #tS = inject(ToastrNotificationService);

  getEstabAsign() {
    this.#sharedService.getEstabAsign().subscribe((response) => {
      if (response) {
        this.establecimientos = response;
      }
    });
  }

  ngOnInit() {
    this.getEstabAsign();
    this.productionAreaForm.patchValue({
      establecimientoId: this.data.establecimientoId,
    });
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Piso';
      this.productionAreaForm.patchValue(this.data);
    }
  }

  onSave() {
    if (this.productionAreaForm.invalid) {
      return this.#tS.show({
        type: 'warning',
        message: 'Revise los datos correctos',
      });
    }

    const dataToSave = {
      ...this.productionAreaForm.value,
    };

    if (this.data.id > 0) {
      this.#productionAreaService.put(this.data.id, dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    } else {
      this.#productionAreaService.post(dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    }
  }

  onModalClose() {
    this.#modalRef.close();
  }

  setCode() {
    const description = this.productionAreaForm.get('description')?.value;
    if (description) {
      this.productionAreaForm.patchValue({
        code: description.substring(0, 3).toUpperCase(),
      });
    }
  }

  successResponse(response: ApiResponseLegacy) {
    this.#tS.show({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.#modalRef.close(response);
    }
  }
}
