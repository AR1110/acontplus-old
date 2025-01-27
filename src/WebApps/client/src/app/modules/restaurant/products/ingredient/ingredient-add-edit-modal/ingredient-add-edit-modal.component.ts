import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IngredientService } from '@restaurant/data/services/ingredient.service';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IngredientType } from '@restaurant/domain/models/ingredient-type';

@Component({
    selector: 'app-ingredient-add-edit-modal',
    imports: [ReactiveFormsModule, FaIconComponent],
    templateUrl: './ingredient-add-edit-modal.component.html',
    styles: ``
})
export class IngredientAddEditModalComponent {
  data = {} as Ingredient;
  modalIcon: IconProp = 'plus';
  ingredientForm = new FormGroup({
    id: new FormControl(0),
    ingredientTypeId: new FormControl(0),
    summary: new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
    quantity: new FormControl(1),
    unit: new FormControl(1),
    content: new FormControl(''),
    enabled: new FormControl(true),
  });
  modalTitle: string = 'Registrar Ingrediente';
  ingredientTypes: IngredientType[] = [];
  #ingredientService = inject(IngredientService);
  #modalRef = inject(NgbActiveModal);
  #tS = inject(ToasterService);

  ngOnInit() {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Ingrediente';
      this.ingredientForm.patchValue(this.data);
    }
  }

  onModalClose() {
    this.#modalRef.close();
  }

  onSave() {
    if (this.ingredientForm.invalid) {
      return this.#tS.toastr({
        type: 'warning',
        message: 'Revise que los datos esten correctos',
      });
    }
    const dataToSave = {
      ...this.ingredientForm.value,
    };
    if (this.data.id > 0) {
      this.#ingredientService
        .put(this.data.id, dataToSave)
        .subscribe((response) => {
          this.#tS.toastr({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code === '1') {
            this.#modalRef.close(response);
          }
        });
    }
  }
}
