import {
  Component,
  input,
  Input,
  output,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
export interface ProductImage {
  id?: string | number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  type: 'main' | 'gallery' | 'variant' | 'detail';
  isPrimary?: boolean;
  order?: number;
}

export interface ProductWithImprovedImages {
  images: ProductImage[];
  imageUrl?: string; // Backward compatibility

  // Badges para mostrar en la imagen
  badges?: ProductBadge[];
}

export interface ProductBadge {
  type: 'new' | 'sale' | 'bestseller' | 'limited' | 'exclusive' | 'discount';
  text?: string;
  color?: string;
  backgroundColor?: string;
}

@Component({
  selector: 'app-product-autocomplete-image',
  imports: [MatIcon, MatTooltip],
  templateUrl: './product-autocomplete-image.component.html',
  styleUrl: './product-autocomplete-image.component.scss',
})
export class ProductAutocompleteImageComponent implements OnInit, OnDestroy {
  @Input() product!: any;
  size = input<'small' | 'medium' | 'large'>('medium');
  enableZoom = input(true);
  enableQuickView = input(true);
  showStockBadge = input(true);
  showNavigation = input(true);
  autoRotate = input(false);
  rotateInterval = input(3000);

  imageClick = output<ProductImage>();
  quickView = output<ProductWithImprovedImages>();
  imageLoad = output<void>();
  imageError = output<void>();

  isLoading = signal(false);
  hasError = false;
  isHovered = false;
  currentImageIndex = 0;
  autoRotateTimer?: any;

  ngOnInit() {
    if (this.autoRotate() && this.hasMultipleImages) {
      this.startAutoRotate();
    }
  }

  ngOnDestroy() {
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
    }
  }

  get currentImageUrl(): string {
    const images = this.getDisplayImages();
    if (images.length === 0) {
      return this.getPlaceholderImage();
    }

    const currentImage = images[this.currentImageIndex];
    return currentImage?.thumbnailUrl || currentImage?.url || this.getPlaceholderImage();
  }

  get currentImageAlt(): string {
    const images = this.getDisplayImages();
    const currentImage = images[this.currentImageIndex];
    return currentImage?.alt || this.product?.name || 'Imagen del producto';
  }

  get hasMultipleImages(): boolean {
    return this.getDisplayImages().length > 1;
  }

  getDisplayImages(): ProductImage[] {
    if (!this.product?.images?.length) {
      // Fallback a imageUrl si no hay images array
      if (this.product?.imageUrl) {
        return [
          {
            url: this.product.imageUrl,
            type: 'main',
            isPrimary: true,
            alt: this.product.name,
          },
        ];
      }
      return [];
    }

    return this.product.images
      .filter((img: any) => img.url)
      .sort((a: any, b: any) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return (a.order || 0) - (b.order || 0);
      });
  }

  getTotalImages(): number {
    return this.getDisplayImages().length;
  }

  getPlaceholderImage(): string {
    // SVG placeholder inline
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#f0f0f0"/>
        <text x="50%" y="35%" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">
          Producto
        </text>
        <text x="50%" y="65%" text-anchor="middle" font-family="Arial" font-size="8" fill="#ccc">
          Sin imagen
        </text>
      </svg>
    `)}`;
  }

  onMouseEnter() {
    this.isHovered = true;
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
    }
  }

  onMouseLeave() {
    this.isHovered = false;
    if (this.autoRotate() && this.hasMultipleImages) {
      this.startAutoRotate();
    }
  }

  onImageLoad() {
    this.isLoading.set(false);
    this.hasError = false;
    this.imageLoad.emit();
  }

  onImageError() {
    this.isLoading.set(false);
    this.hasError = true;
    this.imageError.emit();
  }

  selectImage(index: number) {
    if (index >= 0 && index < this.getTotalImages()) {
      this.currentImageIndex = index;
      this.isLoading.set(true);
      const images = this.getDisplayImages();
      this.imageClick.emit(images[index]);
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.selectImage(this.currentImageIndex - 1);
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.getTotalImages() - 1) {
      this.selectImage(this.currentImageIndex + 1);
    }
  }

  startAutoRotate() {
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
    }

    this.autoRotateTimer = setInterval(() => {
      if (!this.isHovered && this.hasMultipleImages) {
        const nextIndex = (this.currentImageIndex + 1) % this.getTotalImages();
        this.selectImage(nextIndex);
      }
    }, this.rotateInterval());
  }

  onQuickView() {
    this.quickView.emit(this.product);
  }

  // Métodos para badges
  getBadgeClass(badge: ProductBadge): string {
    return `badge-${badge.type}`;
  }

  getBadgeText(badge: ProductBadge): string {
    if (badge.text) return badge.text;

    const defaultTexts: Record<string, string> = {
      new: 'NUEVO',
      sale: 'OFERTA',
      bestseller: 'TOP',
      limited: 'LIMITED',
      exclusive: 'VIP',
      discount: '%',
    };

    return defaultTexts[badge.type] || badge.type.toUpperCase();
  }

  // Métodos para stock badge
  getStockStatus(): 'available' | 'low' | 'out' {
    const stock = this.product?.stock || 0;
    if (stock === 0) return 'out';
    if (stock <= 5) return 'low';
    return 'available';
  }

  getStockBadgeText(): string {
    const stock = this.product?.stock || 0;
    const status = this.getStockStatus();

    switch (status) {
      case 'out':
        return 'SIN';
      case 'low':
        return 'BAJO';
      default:
        return stock.toString();
    }
  }
}
