import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { imgDefault } from '@core/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './upload-image.component.html',
  styleUrl: `./upload-image.component.scss`
})
export class UploadImageComponent {

  imageUrl: string | ArrayBuffer | null = imgDefault();

  file: File | null = null;

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.file = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDelete(): void {
    this.imageUrl = imgDefault()
    this.file = null;
  }

}
