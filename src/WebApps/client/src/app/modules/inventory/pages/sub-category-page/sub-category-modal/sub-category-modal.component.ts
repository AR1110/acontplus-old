import { Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxFileDropEntry } from "ngx-file-drop";
import { AppModule } from "src/app/app.module";


@Component({
  selector: 'app-sub-category-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './sub-category-modal.component.html',

})

export class SubCategoryModalComponent {
  private activeModal = inject(NgbActiveModal);
  titleModal = 'Nueva Categoria';

  files: NgxFileDropEntry[] = [];
  croppedImage: any;

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

  closeModal() {
    this.activeModal.dismiss();
  }
}
