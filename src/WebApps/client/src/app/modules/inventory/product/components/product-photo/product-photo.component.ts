import { NgClass } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ToasterService } from '@core/services/toaster.service';
import { ProductPhotoService } from '@inventory/services/product-photo.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-product-photo',
    imports: [
        NgClass,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './product-photo.component.html',
    styleUrl: './product-photo.component.scss'
})
export class ProductPhotoComponent {
  @Input() params = {} as any;
  modal = inject(NgbActiveModal)
  private tS = inject(ToasterService)
  private productPhotoSvc = inject(ProductPhotoService)

  selectedFile: File | null = null;

  productPhoto = {
    idArticulo: 0,
    id: 0,
    s3ObjectKey: null,
    s3ObjectUrl: null,
    descripcion: ''
  }

  private isRefresh = signal(false)
  productPhotos = signal<any[]>([])

  private getProductPhotos() {
    this.productPhotoSvc.getByProductId(this.productPhoto.idArticulo).subscribe(response => {
      this.productPhotos.set(response.productPhotos)
    })
  }

  ngOnInit() {
    this.productPhoto = this.params
    this.getProductPhotos()
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      // Validate the file size
      if (file.size > 1 * 1024 * 1024) {
        this.tS.toastr({
          type: 'warning',
          message: 'El archivo debe ser menor de 1MB.'
        })
        return;
      }

      // Validate the file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.tS.toastr({
          type: 'warning',
          message: 'Solo se permiten imágenes PNG o JPEG.'
        })
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
      this.tS.toastr({
        type: 'warning',
        message: 'No hay archivo seleccionado.'
      })
      return;
    }


    let src = URL.createObjectURL(this.selectedFile)

    let { isConfirmed } = await Swal.fire({
      title: 'Esta seguro de subir esta foto?',
      imageHeight: 300,
      imageUrl: src,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false
    })

    if (isConfirmed) {

      if (this.productPhoto.id > 0) {
        let data = {
          id: this.productPhoto.id,
          s3ObjectKey: this.productPhoto.s3ObjectKey,
          s3ObjectUrl: this.productPhoto.s3ObjectUrl
        }
        this.productPhotoSvc.put(this.productPhoto.id, data, this.selectedFile).subscribe(response => {
          if (response.code === "0") {
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code === "1") {
            this.tS.toastr({
              type: 'success',
              message: response.message
            })
            this.getProductPhotos();
            this.isRefresh.set(true)
          }
        })
      } else {
        this.productPhotoSvc.post(this.productPhoto.idArticulo, this.selectedFile).subscribe(response => {
          if (response.code === "0") {
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code === "1") {
            this.tS.toastr({
              type: 'success',
              message: response.message
            })
            this.selectedFile = null;
            this.getProductPhotos();
            this.isRefresh.set(true)
          }
        })
      }
    }
  }

  async setDefault(item: any) {
    if (item.isDefault) {
      return
    }
    let { isConfirmed } = await Swal.fire({
      title: 'Esta seguro/a de colocar como predeterminada esta imagen?',
      imageHeight: 300,
      imageUrl: item.s3ObjectUrl,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false
    })

    if (isConfirmed) {

      this.productPhotoSvc.setDefault(item.id, !item.isDefault).subscribe(response => {
        if (response.code === "0") {
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if (response.code === "1") {
          this.tS.toastr({
            type: 'success',
            message: response.message
          })
          this.selectedFile = null;
          this.getProductPhotos();
          this.isRefresh.set(true)
        }
      })
    }
  }

  async removePhoto(item: any) {
    let { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: 'Esta seguro/a de eliminar la imagen?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false
    })

    if (isConfirmed) {
      this.productPhotoSvc.updateStatus(item.id).subscribe(response => {
        if (response.code === "0") {
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if (response.code === "1") {
          this.tS.toastr({
            type: 'success',
            message: response.message
          })
          this.selectedFile = null;
          this.getProductPhotos();
          this.isRefresh.set(true)
        }
      })
    }
  }


  closeModal() {
    this.modal.close({
      isRefresh: this.isRefresh()
    })
  }

}
