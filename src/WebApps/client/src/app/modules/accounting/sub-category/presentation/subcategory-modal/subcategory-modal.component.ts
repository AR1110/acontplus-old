import { Component, inject } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { Subcategory } from '@accounting/sub-category/domain/subcategory';
import { Category } from '@accounting/category/domain/category';
import {ApiResponse } from '@core/models/api-response';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SubCategoryUseCase } from '@accounting/sub-category/application/sub-category.use-case';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-subcategory-modal',
  imports: [ReactiveFormsModule,  ThemeButtonComponent, MatCustomDialogComponent],
  templateUrl: './subcategory-modal.component.html',
  styles: ``,
})
export class SubcategoryModalComponent {
  data = inject<Subcategory>(MAT_DIALOG_DATA)
  categories: Category[] = [];
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
      this.categories = response.categories;
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
      this.toastService.toastr({
        type: 'warning',
        message: 'Debe seleccionar una categoría',
      });
      return;
    }
    if (this.data.id > 0) {
      this._subCategoryUseCase
        .update(this.data.id, dataToSave)
        .subscribe(this.successResponse);
    } else {
      this._subCategoryUseCase
        .create(dataToSave)
        .subscribe(this.successResponse);
    }
  }

  setCode($event: any) {
    const code =
      $event.target.value.length >= 2
        ? $event.target.value.substring(0, 2).toUpperCase()
        : $event.target.value.toUpperCase();
    this.subcategoryForm.get('code')?.setValue(code);
  }

  successResponse = (response: ApiResponse) => {
      this.toastService.toastr({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code == '1') {
        this.modalRef.close(response);
      }
  };
}
