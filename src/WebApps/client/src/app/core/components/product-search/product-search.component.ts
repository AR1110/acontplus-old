import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ProductSearch } from '@modules/inventory/models/product.model';
import { ProductService } from '@modules/inventory/services/product.service';
import {
  Observable,
  OperatorFunction,
  catchError,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [AppModule],
  templateUrl: './product-search.component.html',
  styles: ``,
})
export class ProductSearchComponent {
  @Input() textSearch: any = '';
  @Output() onProductSelected = new EventEmitter<{ data: any }>();
  @Output() resultEmptyInput = new EventEmitter();
  
  private productService = inject(ProductService);

  product: any = {};
  searching: boolean = false;
  searchFailed: boolean = false;

  onKeyupSearch() {
    if (!this.textSearch) {
      this.resultEmptyInput.emit({});
    }
  }

  onSelect($event: any) {
    this.product = $event.item;
    this.onProductSelected.emit({
      data: {
        ...this.product,
      },
    });
    setTimeout(() => {
      this.textSearch = this.product.descripcion;
    });
  }

  search: OperatorFunction<string, Array<ProductSearch>> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        if (!term || term.length < 2) {
          return of([]);
        }
        return this.productService.search({ textSearch: term }).pipe(
          tap(() => (this.searchFailed = false)),
          catchError((error) => {
            console.log(error);
            this.searchFailed = true;
            return of([]);
          })
        );
      })
    );
}
