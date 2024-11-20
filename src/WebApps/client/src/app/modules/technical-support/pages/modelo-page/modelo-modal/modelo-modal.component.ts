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
import { Modelo } from '@modules/technical-support/models/modelo';
import { Serie } from '@modules/technical-support/models/serie';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { ModeloService } from '@modules/technical-support/services/modelo.service';
import { SerieService } from '@modules/technical-support/services/serie.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modelo-modal',
    imports: [FontAwesomeModule, ReactiveFormsModule],
    templateUrl: './modelo-modal.component.html',
    styles: ``
})
export class ModeloModalComponent {
  private modeloService = inject(ModeloService);
  private brandService = inject(BrandService);
  private modalRef = inject(NgbActiveModal);
  private serieService = inject(SerieService);
  private tS = inject(ToasterService);
  modeloForm = new FormGroup({
    id: new FormControl(0),
    brandId: new FormControl(0, Validators.required),
    serieId: new FormControl({ value: 0, disabled: true }),
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
    year: new FormControl(0),
  });
  brands: Brand[] = [];
  data: Modelo = {
    id: 0,
    code: '',
    name: '',
    categoryName: '',
    brandId: 0,
    brandName: '',
  };
  modalIcon: IconProp = 'plus';
  modalTitle = 'Registrar Modelo';
  series: Serie[] = [];

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Modelo';
      this.modeloForm.patchValue(this.data);
      this.onBrandGet(this.data.brandId);
    }
    if (this.data.brandId > 0) {
      this.modeloForm.get('brandId')?.setValue(this.data.brandId);
    }
    this.onGet();
  }
  onBrandChange($event: any) {
    this.onBrandGet($event.target.value);
  }
  onBrandGet(brandId: number) {
    showLoader();
    this.series = [];
    this.serieService.get({ tipo: 2, brandId }).subscribe({
      next: (response) => {
        if (isApiResponse(response) && response.code == '1') {
          this.series = JSON.parse(response.payload as string) || [];
          this.modeloForm.get('serieId')?.enable();
          // const state = false ? 'disable' : 'enable';
          // this.modeloForm.controls['serieId'][state]();
        } else if (this.modeloForm.controls['serieId']) {
          this.modeloForm.get('serieId')?.disable();
        }
      },
      error(err) {
        hideLoader();
      },
      complete() {
        hideLoader();
      },
    });
  }
  onGet() {
    showLoader();
    this.brandService.get({ tipo: 1 }).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
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
