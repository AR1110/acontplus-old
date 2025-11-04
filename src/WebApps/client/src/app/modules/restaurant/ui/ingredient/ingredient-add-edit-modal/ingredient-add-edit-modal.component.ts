import { Component, inject, signal, OnInit } from '@angular/core';
import { IngredientService } from '@restaurant/data/services/ingredient.service';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { IngredientType } from '@restaurant/domain/models/ingredient-type';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-ingredient-add-edit-modal',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ThemeButtonComponent,
    MatCustomDialogComponent,
    ToUpperCaseDirective,
  ],
  templateUrl: './ingredient-add-edit-modal.component.html',
  styles: ``,
})
export class IngredientAddEditModalComponent implements OnInit {
  data = inject<Ingredient>(MAT_DIALOG_DATA);
  modalIcon = 'add';
  ingredientForm = new FormGroup({
    id: new FormControl(0),
    ingredientTypeId: new FormControl(0),
    summary: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    quantity: new FormControl(1),
    unit: new FormControl(1),
    content: new FormControl(''),
    enabled: new FormControl(true),
  });
  modalTitle = 'Registrar Ingrediente';
  ingredientTypes = signal<IngredientType[]>([]);
  #ingredientService = inject(IngredientService);
  #modalRef = inject(MatDialogRef<IngredientAddEditModalComponent>);
  #tS = inject(ToastrNotificationService);

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
      return this.#tS.show({
        type: 'warning',
        message: 'Revise que los datos esten correctos',
      });
    }
    const dataToSave = {
      ...this.ingredientForm.value,
    };
    if (this.data.id > 0) {
      this.#ingredientService.put(this.data.id, dataToSave).subscribe((response) => {
        this.#tS.show({
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
