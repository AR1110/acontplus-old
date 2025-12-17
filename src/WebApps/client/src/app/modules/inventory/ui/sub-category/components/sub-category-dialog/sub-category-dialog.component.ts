import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { UploadImageComponent } from '@shared/components/upload-image/upload-image.component';
import { SubcategoryPhotoService } from '@inventory/data/services/subcategory-photo.service';
import { ProductUseCase } from '@inventory/product/application/use-cases/product.use-case';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { SubCategoryService } from '@inventory/data/services/sub-category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject, signal, OnInit } from '@angular/core';
import { imgDefault, isValidField } from '@core/utils/utils';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-sub-category-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCustomDialogComponent,
    UploadImageComponent,
    ToUpperCaseDirective,
    MatButton,
    MatIconModule,
    MatSlideToggle,
  ],
  templateUrl: './sub-category-dialog.component.html',
})
export class SubCategoryDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SubCategoryDialogComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);

  private _productUseCase = inject(ProductUseCase);

  private subCategorySvc = inject(SubCategoryService);
  private subCategoryPhotoSvc = inject(SubcategoryPhotoService);
  private tS = inject(ToastrNotificationService);

  titleModal = 'Nueva SubFamilia';
  categorias = signal<any[]>([]);

  files: NgxFileDropEntry[] = [];
  croppedImage: any;

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
    s3ObjectKey: null,
    s3ObjectUrl: null,
  };

  private esEditar() {
    return this.params.idSubFamilia > 0;
  }

  private getDataForm() {
    this._productUseCase.getDataForm().subscribe((response) => {
      this.categorias.set(response.categorias);
    });
  }
  ngOnInit(): void {
    this.getDataForm();

    if (typeof this.params === 'object' && this.esEditar()) {
      this.titleModal = 'Editar SubFamilia';
      this.data = structuredClone(this.params);
      this.imageUrl.set(this.params.s3ObjectUrl || imgDefault());
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
      const id = this.params.idSubFamilia as number;
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
    if (this.data.subcategoryPhotoId > 0 && this.selectedFile()) {
      const obj = {
        id: this.data.subcategoryPhotoId,
        s3ObjectKey: this.data.s3ObjectKey,
        s3ObjectUrl: this.data.s3ObjectUrl,
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
        .post(this.params.idSubFamilia, this.selectedFile())
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
  }

  onModalClose() {
    this.dialogRef.close({
      isRefresh: this.isRefresh(),
    });
  }
}
