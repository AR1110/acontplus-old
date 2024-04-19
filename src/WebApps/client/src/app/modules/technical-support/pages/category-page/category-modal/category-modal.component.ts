import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Category } from '@modules/technical-support/models/category';
import { CategoryService } from '@modules/technical-support/services/category.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './category-modal.component.html',
  styles: ``,
})
export class CategoryModalComponent {
  private categoryService = inject(CategoryService);
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);
  categoryForm = new FormGroup({
    id: new FormControl(0),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
  });
  data: Category = {
    id: 0,
    code: '',
    name: '',
  };
  modalIcon: IconProp = 'plus';
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
    showLoader();
    const dataToSave = {
      ...this.categoryForm.value,
    };
    if (this.data.id > 0) {
      this.categoryService.put(this.data.id, dataToSave).subscribe({
        next: this.successResponse,
        error(err) {
          console.error(err);
          hideLoader();
        },
        complete() {
          hideLoader();
        },
      });
    } else {
      this.categoryService.post(dataToSave).subscribe({
        next: this.successResponse,
        error(err) {
          console.error(err);
          hideLoader();
        },
        complete() {
          hideLoader();
        },
      });
    }
  }
  successResponse = (response: object) => {
    if (isApiResponse(response)) {
      this.tS.toastr({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code == '1') {
        this.modalRef.close(response);
      }
    }
  };
}
