import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-product-stock',
  imports: [MatProgressSpinner],
  templateUrl: './product-stock.html',
  styleUrl: './product-stock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductStock implements OnInit {
  id = input.required<number>();
  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);
  private destroyRef = inject(DestroyRef);
  establishments = signal<any[]>([]);

  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this._PRODUCT_SERVICE
      .getEstabStock(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.establishments.set(response.establishments);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        },
      });
  }
}
