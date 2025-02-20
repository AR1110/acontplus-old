import { imgDefault } from '@/domain/utils/utils';
import { NgClass } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-category-card',
  imports: [NgClass],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  categories = input<any>([]);

  getClasses() {
    return {};
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = imgDefault; // Imagen por defecto
  }
}
