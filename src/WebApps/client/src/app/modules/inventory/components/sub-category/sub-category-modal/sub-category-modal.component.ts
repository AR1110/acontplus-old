import { Component, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import { imgDefault, isValidField } from "@core/utils/utils";
import { ProductService } from "@modules/inventory/services/product.service";
import { SubCategoryService } from "@modules/inventory/services/sub-category.service";
import { SubcategoryPhotoService } from "@modules/inventory/services/subcategory-photo.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UploadImageComponent } from "@shared/components/upload-image/upload-image.component";
import { ToUpperCaseDirective } from "@shared/directives/ui/to-upper-case.directive";
import { NgxFileDropEntry } from "ngx-file-drop";


@Component({
  selector: 'app-sub-category-modal',
  standalone: true,
  imports: [
    FormsModule,
    UploadImageComponent,
    ToUpperCaseDirective
  ],
  templateUrl: './sub-category-modal.component.html',

})

export class SubCategoryModalComponent {
  private activeModal = inject(NgbActiveModal);
  private productSvc = inject(ProductService)
  private subCategorySvc = inject(SubCategoryService)
  private subCategoryPhotoSvc = inject(SubcategoryPhotoService)
  private tS = inject(ToasterService)

  params = input<any>({})

  titleModal = 'Nueva Categoria';
  categorias: any[] = []

  files: NgxFileDropEntry[] = [];
  croppedImage: any;

  imageUrl = signal(imgDefault())
  selectedFile = signal<any>('')
  isRefresh = signal(false)

  data = {
    subcategoryPhotoId: 0,
    idFamilia: 0,
    descripcion: '',
    siglas: '',
    montoObjetivo: 0,
    ultimoSecuencial: 0,
    estado: true,
    s3ObjectKey: null,
    s3ObjectUrl: null
  }

  private esEditar() {
    return this.params().idSubFamilia > 0
  }

  private getDataForm() {
    this.productSvc.getDataForm().subscribe(response => {
      this.categorias = response.categorias;
    })
  }
  ngOnInit(): void {
    this.getDataForm()

    if (typeof this.params() === 'object' && this.esEditar()) {
      this.titleModal = 'Editar Categoria';
      this.data = structuredClone(this.params())
      this.imageUrl.set(this.params().s3ObjectUrl || imgDefault())
    }
  }

  generateSigla() {
    if (isValidField(this.data.descripcion) && !this.esEditar()) {
      this.data.siglas = this.data.descripcion.slice(0, 3)
    }
  }

  onSelected($event: any) {
    this.selectedFile.set($event)

    if (this.esEditar()) {
      this.uploadFile()
    }
  }


  private successResponse = (response: ApiResponse) => {
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
      this.activeModal.close({ isRefresh: true })
    }
  }
  save() {

    if (!isValidField(this.data.descripcion)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese la Descripción'
      })
      return
    }


    if (!isValidField(this.data.siglas)) {
      this.tS.toastr({
        type: 'warning',
        message: 'Ingrese la Sigla'
      })
      return
    }
    if (this.esEditar() && this.data.ultimoSecuencial) {
      if (!this.data.ultimoSecuencial) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese Nro. Secuencial'
        })
        return
      }

      if (isNaN(this.data.ultimoSecuencial) || this.data.ultimoSecuencial < 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Nro. Secuencial tiene que ser un número'
        })
        return
      }
    }

    try {
      let data = {
        idFamilia: this.data.idFamilia || null,
        descripcion: this.data.descripcion,
        siglas: this.data.siglas,
        montoObjetivo: this.data.montoObjetivo || 0,
        estado: this.data.estado,
        secuencial: this.data.ultimoSecuencial || 0
      }
      let id = this.params().idSubFamilia as number
      if (id > 0) {
        this.subCategorySvc.put(id, data).subscribe(this.successResponse)

      } else {
        this.subCategorySvc.post(data, this.selectedFile()).subscribe(this.successResponse)
      }

    } catch (error) {
      console.log(error)
    }
  }

  private uploadFile() {
    if (this.data.subcategoryPhotoId > 0 && this.selectedFile()) {
      let obj = {
        id: this.data.subcategoryPhotoId,
        s3ObjectKey: this.data.s3ObjectKey,
        s3ObjectUrl: this.data.s3ObjectUrl
      }
      this.subCategoryPhotoSvc.put(obj, this.data.subcategoryPhotoId, this.selectedFile()).subscribe(response => {
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
          this.isRefresh.set(true)

        }
      })

    }
    if (this.esEditar() && this.data.subcategoryPhotoId == 0 && this.selectedFile()) {

      this.subCategoryPhotoSvc.post(this.params().idSubFamilia, this.selectedFile()).subscribe(response => {
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
          this.isRefresh.set(true)
        }
      })
    }
  }

  closeModal() {
    this.activeModal.close({
      isRefresh: this.isRefresh()
    });
  }
}
