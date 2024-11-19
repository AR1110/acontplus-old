import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { GroupedEstab } from '@core/models/estab.model';
import { ProductService } from '@inventory/product/product.service';
import { GroupedSubFamilia } from '@modules/inventory/models/sub-category.model';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '@core/services/shared.service';
import { RESTAURANT_CODE_REPORT } from '@modules/restaurant/enums/restaurant.enum';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ItemService } from '@modules/restaurant/services/item.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { isValidField } from '@core/utils/utils';

@Component({
  selector: 'app-item-report',
  standalone: true,
  templateUrl: './item-report.component.html',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    MatAutocompleteModule,
    AsyncPipe,
  ],
})
export class ItemReportComponent {
  checkedSubCategorias = new FormControl('');
  establecimientos: Array<GroupedEstab> = [];
  subCategorias: Array<GroupedSubFamilia> = [];
  control = new FormControl('');
  filteredProducts!: Observable<any[]>;
  dataSearch = {
    codEstab: '',
    itemId: 0,
  };
  private productSvc = inject(ProductService);
  private sharedSvc = inject(SharedService);
  private itemSvc = inject(ItemService);

  ngOnInit() {
    showLoader();
    this.productSvc.getDataReport().subscribe({
      next: (response) => {
        hideLoader();
        const { estabs, subCategorias } = response;
        this.establecimientos = estabs;
        this.subCategorias = subCategorias;
        const dataEstab = this.establecimientos.find((e) => e.defaultEstab);
        if (dataEstab) {
          this.dataSearch.codEstab = dataEstab.codEstab;
        }
      },
      error(err) {
        hideLoader();
        console.log(err);
      },
    });

    this.filteredProducts = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val) => {
        if (val && val.length > 2) {
          return this._filter(val);
          // return this.products as any[]
        }
        return [];
      }),
    );
  }

  onSelectionChange(event: any) {
    this.dataSearch.itemId = event.id;
  }

  async getReport(format: 'pdf' | 'excel') {
    let checkedSubCategorias = this.checkedSubCategorias.value;
    try {
      let subCategoriasChecked =
        Array.isArray(checkedSubCategorias) && checkedSubCategorias.join(',');

      const dataSearch = {
        codEstab: this.dataSearch.codEstab,
        subCategoriasChecked: isValidField(subCategoriasChecked),
        itemId: isValidField(this.dataSearch.itemId),
      };
      const parameters = {
        hasService: false,
        hasIdUsuarioRol: true,
        reportParams: JSON.stringify({
          hasParams: false,
          codigo: RESTAURANT_CODE_REPORT.RII,
          codEstab: dataSearch.codEstab,
          format,
          aditionalParams: [],
        }),
        dataParams: JSON.stringify(dataSearch),
      };

      this.sharedSvc.getReport({ data: parameters, format: format });
    } catch (error) {
      console.log(error);
    }
  }

  private _filter(value: string) {
    const filterValue = this._normalizeValue(value);
    return this.itemSvc.search({ textSearch: filterValue }).pipe(
      map((response) => {
        return response;
      }),
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
