import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductService } from "@modules/inventory/services/product.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UploadImageComponent } from "@shared/components/upload-image/upload-image.component";
import { NgxFileDropEntry } from "ngx-file-drop";


@Component({
  selector: 'app-sub-category-modal',
  standalone: true,
  imports: [
    FormsModule,
    UploadImageComponent
  ],
  templateUrl: './sub-category-modal.component.html',

})

export class SubCategoryModalComponent {
  private activeModal = inject(NgbActiveModal);
  private productSvc = inject(ProductService)
  titleModal = 'Nueva Categoria';
   categorias: any[] = []

  files: NgxFileDropEntry[] = [];
  croppedImage: any;

  data = {
    idFamilia: 0
  }

  dropped(files: any) {
    this.files = files;
    console.log(this)
    if (files.length === 1) {
      const fileEntry = files[0].fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        // Process the dropped file, for example, display a preview
        const reader = new FileReader();
        reader.onload = () => {
          this.croppedImage = reader.result;
        };
        reader.readAsDataURL(file);
      });
    }
  }

  fileOver(event: any) {
    console.log(this)
    // Handle file over event if needed
  }

  fileLeave(event: any) {
    console.log('kjihfkjf')
    // Handle file leave event if needed
  }

  imageCropped(event: any) {
    // Handle cropped image event if needed
    this.croppedImage = event.base64;
  }

  private getDataForm() {
    this.productSvc.getDataForm().subscribe(response => {
      this.categorias = response.categorias;
    })
  }
  ngOnInit(): void {
    this.getDataForm()

  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
