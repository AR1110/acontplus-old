import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetEstabStockUseCase } from '@inventory/product/application/use-cases/product.use-case';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-product-stock',
  imports: [MatProgressSpinner],
  templateUrl: './product-stock.html',
  styleUrl: './product-stock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductStock {
  id = input.required<number>();
  private $useCase = inject(GetEstabStockUseCase);
  private destroyRef = inject(DestroyRef);
  establishments = signal<any[]>([]);

  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    this.$useCase
      .execute(this.id())
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
