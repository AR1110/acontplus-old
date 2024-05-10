import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '@core/services/toaster.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '@technical-support/models/category';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { isApiResponse } from '@core/models/api-response';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryService } from '@modules/accounting/services/category.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './category-modal.component.html',
  styles: ``,
})
export class CategoryModalComponent {
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
  data: Category = {} as Category;
  modalIcon: IconProp = 'plus';
  modalTitle = 'Registrar Categoría';
  tipos: any[] = [];
  private categoryService = inject(CategoryService);
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);

  get() {
    this.categoryService.get({ tipo: 2 }).subscribe((response) => {
      if (isApiResponse(response) && response.code == '1') {
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
      this.categoryService.post(dataToSave).subscribe(this.successResponse);
    } else {
      this.categoryService
        .put(this.data.id, dataToSave)
        .subscribe(this.successResponse);
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
