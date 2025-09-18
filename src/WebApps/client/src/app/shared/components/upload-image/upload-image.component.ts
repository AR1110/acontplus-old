import {
  Component,
  output,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  effect,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { imgDefault } from '@core/utils/utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-image',
  imports: [CommonModule, MatIcon],
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadImageComponent {
  // input solo lectura
  imageUrlInput = input<string | ArrayBuffer | null>(imgDefault());

  // signal editable para preview
  imageUrl = signal<string | ArrayBuffer | null>(this.imageUrlInput());

  showImgUrl = computed(() => {
    return this.imageUrl();
  });

  file: File | null = null;
  onSelected = output<File | null>();

  constructor() {
    effect(() => {
      this.imageUrl.set(this.imageUrlInput());
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.file = null;
      this.onSelected.emit(null);
      return;
    }

    const file = input.files[0];
    this.file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    this.onSelected.emit(this.file);
  }

  onDelete(): void {
    this.imageUrl.set(imgDefault());
    this.file = null;
    this.onSelected.emit(null);
  }
}
