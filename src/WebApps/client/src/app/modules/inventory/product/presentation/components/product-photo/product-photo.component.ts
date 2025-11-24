import { Component, inject, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicCard } from '@acontplus/ng-components';
import { MatIconModule } from '@angular/material/icon';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import Swal from 'sweetalert2';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductPhotoPostUseCase } from '@inventory/product/application/use-cases/product-photo/product-photo-post.use-case';
import { ProductPhotoPutUseCase } from '@inventory/product/application/use-cases/product-photo/product-photo-put.use-case';
import { GetProductPhotoUseCase } from '@inventory/product/application/use-cases/product-photo/get-product-photo.use-case';
import { ProductPhotoDefaultUseCase } from '@inventory/product/application/use-cases/product-photo/product-photo-default.use-case';
import { ProductPhotoPutStatusUseCase } from '@inventory/product/application/use-cases/product-photo/product-photo-put-status.use-case';

@Component({
  selector: 'app-product-photo',
  imports: [
    DynamicCard,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCustomDialogComponent,
  ],
  templateUrl: './product-photo.component.html',
  styleUrl: './product-photo.component.scss',
})
export class ProductPhotoComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ProductPhotoComponent>);
  readonly params = inject(MAT_DIALOG_DATA);
  private tS = inject(ToastrNotificationService);
  private $productPhotoPostUseCase = inject(ProductPhotoPostUseCase);
  private $productPhotoPutUseCase = inject(ProductPhotoPutUseCase);
  private $getProductPhotoUseCase = inject(GetProductPhotoUseCase);
  private $productPhotoDefaultUseCase = inject(ProductPhotoDefaultUseCase);
  private $productPhotoPutStatusUseCase = inject(ProductPhotoPutStatusUseCase);

  selectedFile: File | null = null;

  productPhoto = {
    idArticulo: 0,
    id: 0,
    s3ObjectKey: null,
    s3ObjectUrl: null,
    descripcion: '',
  };

  private isRefresh = signal(false);
  productPhotos = signal<any[]>([]);

  private getProductPhotos() {
    this.$getProductPhotoUseCase.execute(this.productPhoto.idArticulo).subscribe((response) => {
      if (response.payload) {
        this.productPhotos.set(response.payload.productPhotos);
      }
    });
  }

  ngOnInit() {
    this.productPhoto = this.params;
    this.getProductPhotos();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      // Validate the file size
      if (file.size > 1 * 1024 * 1024) {
        this.tS.show({
          type: 'warning',
          message: 'El archivo debe ser menor de 1MB.',
        });
        return;
      }

      // Validate the file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.tS.show({
          type: 'warning',
          message: 'Solo se permiten imágenes PNG o JPEG.',
        });
        return;
      }

      // Set the selected file
      this.selectedFile = file;

      // Optionally, trigger the upload process
      this.upload();
    }
  }

  async upload() {
    if (!this.selectedFile) {
      this.tS.show({
        type: 'warning',
        message: 'No hay archivo seleccionado.',
      });
      return;
    }

    const src = URL.createObjectURL(this.selectedFile);

    const { isConfirmed } = await Swal.fire({
      title: 'Esta seguro de subir esta foto?',
      imageHeight: 300,
      imageUrl: src,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    });

    if (isConfirmed) {
      if (this.productPhoto.id > 0) {
        const data = {
          id: this.productPhoto.id,
          s3ObjectKey: this.productPhoto.s3ObjectKey,
          s3ObjectUrl: this.productPhoto.s3ObjectUrl,
        };

        this.$productPhotoPutUseCase
          .execute({
            id: this.productPhoto.id,
            data,
            file: this.selectedFile,
          })
          .subscribe((response) => {
            if (response.code === '0') {
              this.tS.show({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code === '1') {
              this.tS.show({
                type: 'success',
                message: response.message,
              });
              this.getProductPhotos();
              this.isRefresh.set(true);
            }
          });
      } else {
        this.$productPhotoPostUseCase
          .execute({
            productId: this.productPhoto.idArticulo,
            file: this.selectedFile,
          })
          .subscribe((response) => {
            if (response.code === '0') {
              this.tS.show({
                type: 'warning',
                message: response.message,
              });
            }
            if (response.code === '1') {
              this.tS.show({
                type: 'success',
                message: response.message,
              });
              this.selectedFile = null;
              this.getProductPhotos();
              this.isRefresh.set(true);
            }
          });
      }
    }
  }

  async setDefault(item: any) {
    if (item.isDefault) {
      return;
    }
    const { isConfirmed } = await Swal.fire({
      title: 'Esta seguro/a de colocar como predeterminada esta imagen?',
      imageHeight: 300,
      imageUrl: item.s3ObjectUrl,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    });

    if (isConfirmed) {
      this.$productPhotoDefaultUseCase.execute(item.id, !item.isDefault).subscribe((response) => {
        if (response.code === '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code === '1') {
          this.tS.show({
            type: 'success',
            message: response.message,
          });
          this.selectedFile = null;
          this.getProductPhotos();
          this.isRefresh.set(true);
        }
      });
    }
  }

  async removePhoto(item: any) {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: 'Esta seguro/a de eliminar la imagen?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    });

    if (isConfirmed) {
      this.$productPhotoPutStatusUseCase.execute(item.id).subscribe((response) => {
        if (response.code === '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code === '1') {
          this.tS.show({
            type: 'success',
            message: response.message,
          });
          this.selectedFile = null;
          this.getProductPhotos();
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
