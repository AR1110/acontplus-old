import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { GroupedEstab } from '@core/models/estab.model';
import { GroupedSubFamilia } from '@inventory/data/models/sub-category.model';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '@core/services/shared.service';
import { RESTAURANT_CODE_REPORT } from '@restaurant/domain/enums/restaurant.enum';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ItemService } from '@restaurant/data/services/item.service';

import { isValidField } from '@core/utils/utils';
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    MatAutocompleteModule,
    AsyncPipe,
    Button,
    DynamicCard,
    MatInput,
  ],
})
export class ItemReportComponent implements OnInit {
  checkedSubCategorias = new FormControl('');
  establecimientos = signal<GroupedEstab[]>([]);
  subCategorias = signal<GroupedSubFamilia[]>([]);
  control = new FormControl('');
  filteredProducts!: Observable<any[]>;
  dataSearch = {
    codEstab: '',
    itemId: 0,
  };
  private sharedSvc = inject(SharedService);
  private itemSvc = inject(ItemService);
  private _PRODUCT_SERVICE = inject(PRODUCT_SERVICE);

  ngOnInit() {
    this._PRODUCT_SERVICE.getDataReport().subscribe((response) => {
      const { estabs, subCategorias } = response;
      this.establecimientos.set(estabs);
      this.subCategorias.set(subCategorias);
      const dataEstab = this.establecimientos().find((e) => e.defaultEstab);
      if (dataEstab) {
        this.dataSearch.codEstab = dataEstab.codEstab;
      }
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
    const checkedSubCategorias = this.checkedSubCategorias.value;
    try {
      const subCategoriasChecked =
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
