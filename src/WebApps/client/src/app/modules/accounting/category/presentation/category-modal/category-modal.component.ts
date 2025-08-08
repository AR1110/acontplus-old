import { Component, inject, OnInit } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '@technical-support/models/category';
import { ApiResponse } from '@core/models/api-response';
import { CategoryUseCase } from '@accounting/category/application/category.use-case';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";

@Component({
  selector: 'app-category-modal',
  imports: [ReactiveFormsModule,  ThemeButtonComponent, MatCustomDialogComponent],
  templateUrl: './category-modal.component.html',
  styles: ``,
})
export class CategoryModalComponent implements OnInit {
  categoryForm = new FormGroup({
    id: new FormControl(0),
    tipoId: new FormControl(0, Validators.required),
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
    enabled: new FormControl(true),
  });
  data = inject<Category>(MAT_DIALOG_DATA);
  modalIcon = 'add';
  modalTitle = 'Registrar Categoría';
  tipos: any[] = [];
  private _categoryUseCase = inject(CategoryUseCase);

  private modalRef = inject(MatDialogRef<CategoryModalComponent>);
  private tS = inject(ToastrNotificationService);

  get() {
    this._categoryUseCase.get({ tipo: 2 }).subscribe((response) => {
      if (response.code == '1') {
        const { tipos } = JSON.parse(response.payload as string);
        this.tipos = tipos;
      }
    });
  }

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Categoría';
      this.categoryForm.patchValue(this.data);
    }
    this.get();
  }

  onModalClose() {
    this.modalRef.close();
  }

  onSave() {
    const dataToSave = {
      ...this.categoryForm.value,
    };
    if (!(this.data.id > 0)) {
      this._categoryUseCase.post(dataToSave).subscribe(this.successResponse);
    } else {
      this._categoryUseCase
        .put(this.data.id, dataToSave)
        .subscribe(this.successResponse);
    }
  }

  successResponse = (response: ApiResponse) => {
    this.tS.show({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.modalRef.close(response);
    }
  };
}
