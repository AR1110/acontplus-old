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
import { Brand } from '@modules/technical-support/models/brand';
import { Category } from '@modules/technical-support/models/category';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { CategoryService } from '@modules/technical-support/services/category.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-brand-modal',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './brand-modal.component.html',
  styles: ``,
})
export class BrandModalComponent {
  private brandService = inject(BrandService);
  private categoryService = inject(CategoryService);
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);
  brandForm = new FormGroup({
    id: new FormControl(0),
    categoryId: new FormControl(0, Validators.required),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
  });
  categories: Category[] = [];
  data: Brand = {
    id: 0,
    code: '',
    name: '',
    categoryName: ''
  };
  modalIcon: IconProp = 'plus';
  modalTitle = 'Registrar Marca';

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Marca';
      this.brandForm.patchValue(this.data);
    }
    this.onGet();
  }
  onGet() {
    showLoader();
    this.categoryService.get({}).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            console.log(response);
            console.log(JSON.parse(response.payload as string));
            this.categories = JSON.parse(response.payload as string);
          }
        }
      },
      error(err) {
        hideLoader();
        console.log(err);
      },
      complete() {
        hideLoader();
      },
    });
  }
  onModalClose() {
    this.modalRef.close();
  }
  onSave() {
    showLoader();
    const dataToSave = {
      ...this.brandForm.value,
    };
    console.log(dataToSave);
    if (this.data.id > 0) {
      this.brandService.put(this.data.id, dataToSave).subscribe({
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
      this.brandService.post(dataToSave).subscribe({
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
