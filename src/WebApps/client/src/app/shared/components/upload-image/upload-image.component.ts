import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { imgDefault } from '@core/utils/utils';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-upload-image',
  imports: [CommonModule, MatIcon],
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent {
  onSelected = output<File | null>();

  @Input() imageUrl: string | ArrayBuffer | null = imgDefault();

  file: File | null = null;

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.file = file;
    this.onSelected.emit(this.file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDelete(): void {
    this.imageUrl = imgDefault();
    this.file = null;
    this.onSelected.emit(null);
  }
}
