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
import { Serie } from '@modules/technical-support/models/serie';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { ModeloService } from '@modules/technical-support/services/modelo.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modelo-modal',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './modelo-modal.component.html',
  styles: ``,
})
export class ModeloModalComponent {
  private modeloService = inject(ModeloService);
  private brandService = inject(BrandService);
  private modalRef = inject(NgbActiveModal);
  private tS = inject(ToasterService);
  modeloForm = new FormGroup({
    id: new FormControl(0),
    brandId: new FormControl(0, Validators.required),
    serieId: new FormControl(0),
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
    year: new FormControl(0),
  });
  brands: Brand[] = [];
  data: Brand = {
    id: 0,
    code: '',
    name: '',
  };
  modalIcon: IconProp = 'plus';
  modalTitle = 'Registrar Modelo';
  series: Serie[] = [];

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.modeloForm.patchValue(this.data);
    }
    this.onGet();
  }
  onGet() {
    showLoader();
    this.brandService.get({}).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            console.log(response);
            console.log(JSON.parse(response.payload as string));
            this.brands = JSON.parse(response.payload as string);
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
      ...this.modeloForm.value,
    };
    if (this.data.id > 0) {
      this.modeloService.put(this.data.id, dataToSave).subscribe({
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
      this.modeloService.post(dataToSave).subscribe({
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
