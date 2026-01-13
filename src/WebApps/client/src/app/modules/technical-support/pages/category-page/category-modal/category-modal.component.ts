import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isApiResponse } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { Category } from '@modules/technical-support/models/category';
import { CategoryService } from '@modules/technical-support/services/category.service';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-page-modal',
  imports: [ReactiveFormsModule, Button, MatCustomDialogComponent],
  templateUrl: './category-modal.component.html',
  styles: ``,
})
export class CategoryModalComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private modalRef = inject(MatDialogRef<CategoryModalComponent>);
  private tS = inject(ToastrNotificationService);
  categoryForm = new FormGroup({
    id: new FormControl(0),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(25),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
  });
  data = inject<Category>(MAT_DIALOG_DATA);
  modalIcon = 'add';
  modalTitle = 'Registrar Categoría';

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Categoría';
      this.categoryForm.patchValue(this.data);
    }
  }
  onModalClose() {
    this.modalRef.close();
  }
  onSave() {
    const dataToSave = {
      ...this.categoryForm.value,
    };
    if (this.data.id > 0) {
      this.categoryService.put(this.data.id, dataToSave).subscribe({
        next: this.successResponse,
        error(err) {
          console.error(err);
        },
        complete() {},
      });
    } else {
      this.categoryService.post(dataToSave).subscribe({
        next: this.successResponse,
        error(err) {
          console.error(err);
        },
        complete() {},
      });
    }
  }
  successResponse = (response: object) => {
    if (isApiResponse(response)) {
      this.tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code == '1') {
        this.modalRef.close(response);
      }
    }
  };
}
