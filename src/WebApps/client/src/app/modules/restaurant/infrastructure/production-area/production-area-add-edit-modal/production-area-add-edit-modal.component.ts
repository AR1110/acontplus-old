import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '@core/services/toaster.service';
import { ApiResponse } from '@core/models/api-response';
import { ProductionArea } from '@restaurant/domain/models/production-area';
import { ProductionAreaService } from '@restaurant/data/services/production-area.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-production-area-add-edit-modal',
    imports: [ReactiveFormsModule, FaIconComponent, MatSlideToggle],
    templateUrl: './production-area-add-edit-modal.component.html',
    styles: ``
})
export class ProductionAreaAddEditModalComponent {
  establecimientoId: number = 0;
  data = {} as ProductionArea;
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
  modalIcon: IconProp = 'plus';
  modalTitle: string = 'Registrar Área de Producción';
  #modalRef = inject(NgbActiveModal);
  #productionAreaService = inject(ProductionAreaService);
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);

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
      return this.#tS.toastr({
        type: 'warning',
        message: 'Revise los datos correctos',
      });
    }

    const dataToSave = {
      ...this.productionAreaForm.value,
    };

    if (this.data.id > 0) {
      this.#productionAreaService
        .put(this.data.id, dataToSave)
        .subscribe((response) => {
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

  successResponse(response: ApiResponse) {
    this.#tS.toastr({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.#modalRef.close(response);
    }
  }
}
