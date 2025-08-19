import {Component, inject, signal, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { Brand } from '@modules/technical-support/models/brand';
import { Modelo } from '@modules/technical-support/models/modelo';
import { Serie } from '@modules/technical-support/models/serie';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { ModeloService } from '@modules/technical-support/services/modelo.service';
import { SerieService } from '@modules/technical-support/services/serie.service';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";

@Component({
  selector: 'app-modelo-modal',
  imports: [ReactiveFormsModule,   ThemeButtonComponent, MatCustomDialogComponent],
  templateUrl: './modelo-modal.component.html',
  styles: ``,
})
export class ModeloModalComponent implements OnInit {
  private modeloService = inject(ModeloService);
  private brandService = inject(BrandService);
  private modalRef = inject(MatDialogRef<ModeloModalComponent>);
  private serieService = inject(SerieService);
  private tS = inject(ToastrNotificationService);
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
  brands =  signal<Brand[]>([])
  data = inject<Modelo>(MAT_DIALOG_DATA);
  modalIcon = 'add';
  modalTitle = 'Registrar Modelo';
  series = signal< Serie[]>([])

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
    this.series.set([]);
    this.serieService.get({ tipo: 2, brandId }).subscribe(  (response) => {
        if (isApiResponse(response) && response.code == '1') {
          this.series.set(JSON.parse(response.payload as string) || []);
          this.modeloForm.get('serieId')?.enable();
          // const state = false ? 'disable' : 'enable';
          // this.modeloForm.controls['serieId'][state]();
        } else if (this.modeloForm.controls['serieId']) {
          this.modeloForm.get('serieId')?.disable();
        }
    });
  }
  onGet() {
    this.brandService.get({ tipo: 1 }).subscribe( (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            this.brands.set(JSON.parse(response.payload as string));
          }
        }
    });
  }
  onModalClose() {
    this.modalRef.close();
  }
  onSave() {
    const dataToSave = {
      ...this.modeloForm.value,
    };
    if (this.data.id > 0) {
      this.modeloService.put(this.data.id, dataToSave).subscribe( this.successResponse);
    } else {
      this.modeloService.post(dataToSave).subscribe( this.successResponse);
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
