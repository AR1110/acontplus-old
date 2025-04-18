import { Component, inject } from '@angular/core';
import { ToasterService } from '@core/services/toaster.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subcategory } from '@accounting/core/models/subcategory';
import { Category } from '@accounting/core/models/category';
import { isApiResponse } from '@core/models/api-response';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SubCategoryUseCase } from '@accounting/core/use-cases/sub-category.use-case';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-subcategory-modal',
  imports: [ReactiveFormsModule, MatIcon, MatButton],
  templateUrl: './subcategory-modal.component.html',
  styles: ``,
})
export class SubcategoryModalComponent {
  data: Subcategory = {} as Subcategory;
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
  private readonly modalRef = inject(NgbActiveModal);
  private readonly toastService = inject(ToasterService);

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
    let code =
      $event.target.value.length >= 2
        ? $event.target.value.substring(0, 2).toUpperCase()
        : $event.target.value.toUpperCase();
    this.subcategoryForm.get('code')?.setValue(code);
  }

  successResponse = (response: object) => {
    if (isApiResponse(response)) {
      this.toastService.toastr({
        type: response.code === '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code == '1') {
        this.modalRef.close(response);
      }
    }
  };
}
