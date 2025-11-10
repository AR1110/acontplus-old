import { Component, inject, signal, OnInit } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { Subcategory } from '@accounting/sub-category/domain/subcategory';
import { Category } from '@accounting/category/domain/category';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SubCategoryUseCase } from '@accounting/sub-category/application/sub-category.use-case';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-subcategory-modal',
  imports: [
    ReactiveFormsModule,
    Button,
    MatCustomDialogComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './subcategory-modal.component.html',
  styles: ``,
})
export class SubcategoryModalComponent implements OnInit {
  data = inject<Subcategory>(MAT_DIALOG_DATA);
  categories = signal<Category[]>([]);
  subcategoryForm = new FormGroup({
    id: new FormControl(0),
    categoryId: new FormControl(0, Validators.required),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100),
    ]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(10),
    ]),
    enabled: new FormControl(true),
  });
  modalIcon = 'add';
  modalTitle = 'Registrar Subcategoría';
  tipos: any[] = [];
  private readonly modalRef = inject(MatDialogRef<SubcategoryModalComponent>);
  private readonly toastService = inject(ToastrNotificationService);

  private _subCategoryUseCase = inject(SubCategoryUseCase);

  get() {
    this._subCategoryUseCase.getDataForm().subscribe((response) => {
      this.categories.set(response.categories);
    });
  }

  ngOnInit() {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Subcategoría';
      this.subcategoryForm.patchValue(this.data);
    }
    this.get();
  }

  onModalClose() {
    this.modalRef.close();
  }

  onSave() {
    const dataToSave = {
      ...this.subcategoryForm.value,
    };
    if (dataToSave.categoryId === 0) {
      this.toastService.show({
        type: 'warning',
        message: 'Debe seleccionar una categoría',
      });
      return;
    }
    if (this.data.id > 0) {
      this._subCategoryUseCase.update(this.data.id, dataToSave).subscribe(this.successResponse);
    } else {
      this._subCategoryUseCase.create(dataToSave).subscribe(this.successResponse);
    }
  }

  setCode($event: any) {
    const code =
      $event.target.value.length >= 2
        ? $event.target.value.substring(0, 2).toUpperCase()
        : $event.target.value.toUpperCase();
    this.subcategoryForm.get('code')?.setValue(code);
  }

  successResponse = (response: ApiResponseLegacy) => {
    this.toastService.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.modalRef.close(response);
    }
  };
}
