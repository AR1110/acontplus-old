import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { UploadImageComponent } from '@shared/components/upload-image/upload-image.component';
import { SubcategoryPhotoService } from '@inventory/data/services/subcategory-photo.service';
import { PRODUCT_SERVICE } from '@inventory/tokens/inventory-token';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { SubCategoryHttp } from '@inventory/data/sub-category-http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject, signal, OnInit } from '@angular/core';
import { imgDefault, isValidField } from '@core/utils/utils';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {SubCategoryListDto} from "@inventory/domain/models/sub-category.model";
import {Button} from "@acontplus/ng-components";

@Component({
  selector: 'app-sub-category-add-edit',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCustomDialogComponent,
    UploadImageComponent,
    ToUpperCaseDirective,
    MatIconModule,
    MatSlideToggle,
    Button,
  ],
  templateUrl: './sub-category-add-edit.html',
})
export class SubCategoryAddEdit implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SubCategoryAddEdit>);
  readonly params = inject<SubCategoryListDto>(MAT_DIALOG_DATA);

  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);

  private subCategorySvc = inject(SubCategoryHttp);
  private subCategoryPhotoSvc = inject(SubcategoryPhotoService);
  private tS = inject(ToastrNotificationService);

  titleModal = 'Nueva SubFamilia';
  categorias = signal<any[]>([]);

  imageUrl = signal(imgDefault());
  selectedFile = signal<any>('');
  isRefresh = signal(false);

  data = {
    subcategoryPhotoId: 0,
    idFamilia: 0,
    descripcion: '',
    siglas: '',
    montoObjetivo: 0,
    ultimoSecuencial: 0,
    estado: true,
  }as SubCategoryListDto

  private esEditar() {
    return this.params.id > 0;
  }

  private getDataForm() {
    this._PRODUCT_SERVICE.getDataForm().subscribe((response) => {
      this.categorias.set(response.categorias);
    });
  }
  ngOnInit(): void {
    this.getDataForm();

    if (typeof this.params === 'object' && this.esEditar()) {
      this.titleModal = 'Editar SubFamilia';
      this.data = structuredClone(this.params);
      this.imageUrl.set(this.params.imageUrl ?? imgDefault());
    }
  }

  generateSigla() {
    if (isValidField(this.data.descripcion) && !this.esEditar()) {
      this.data.siglas = this.data.descripcion.slice(0, 3);
    }
  }

  onSelected($event: any) {
    this.selectedFile.set($event);

    if (this.esEditar()) {
      this.uploadFile();
    }
  }

  private successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      Swal.fire({
        icon: 'warning',
        html: response.message,
      });
    }
    if (response.code === '1') {
      Swal.fire({
        icon: 'success',
        html: response.message,
      });
      this.dialogRef.close({ isRefresh: true });
    }
  };
  save() {
    if (!isValidField(this.data.descripcion)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese la Descripción',
      });
      return;
    }

    if (!isValidField(this.data.siglas)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese la Sigla',
      });
      return;
    }
    if (this.esEditar() && this.data.ultimoSecuencial) {
      if (!this.data.ultimoSecuencial) {
        this.tS.show({
          type: 'warning',
          message: 'Ingrese Nro. Secuencial',
        });
        return;
      }

      if (isNaN(this.data.ultimoSecuencial) || this.data.ultimoSecuencial < 0) {
        this.tS.show({
          type: 'warning',
          message: 'Nro. Secuencial tiene que ser un número',
        });
        return;
      }
    }

    try {
      const data = {
        idFamilia: this.data.idFamilia || null,
        descripcion: this.data.descripcion,
        siglas: this.data.siglas,
        montoObjetivo: this.data.montoObjetivo || 0,
        estado: this.data.estado,
        secuencial: this.data.ultimoSecuencial || 0,
      };
      const id = this.params.id;
      if (id > 0) {
        this.subCategorySvc.put(id, data).subscribe(this.successResponse);
      } else {
        this.subCategorySvc.post(data, this.selectedFile()).subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private uploadFile() {
    if (this.data?.subcategoryPhotoId && this.selectedFile()) {
      const obj = {
        id: this.data.subcategoryPhotoId,
        s3ObjectKey: this.data.s3ObjectKey,
        s3ObjectUrl: this.data.imageUrl,
      };
      this.subCategoryPhotoSvc
        .put(obj, this.data.subcategoryPhotoId, this.selectedFile())
        .subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              html: response.message,
            });
          }
          if (response.code === '1') {
            Swal.fire({
              icon: 'success',
              html: response.message,
            });
            this.isRefresh.set(true);
          }
        });
    }
    if (this.esEditar() && this.data.subcategoryPhotoId == 0 && this.selectedFile()) {
      this.subCategoryPhotoSvc
        .post(this.params.id, this.selectedFile())
        .subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              html: response.message,
            });
          }
          if (response.code === '1') {
            Swal.fire({
              icon: 'success',
              html: response.message,
              timer: 1000
            });
            this.isRefresh.set(true);
          }
        });
    }
  }

  onModalClose() {
    this.dialogRef.close({
      isRefresh: this.isRefresh(),
    });
  }
}
