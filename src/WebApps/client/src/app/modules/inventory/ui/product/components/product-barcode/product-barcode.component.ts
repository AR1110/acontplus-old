import {
  Component,
  inject,
  input,
  model,
  signal,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';

import { finalize } from 'rxjs/operators';
import { getValidId, isValidField } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { NgxColorsModule } from 'ngx-colors';
import { DynamicCard, DataGrid, Button, DataGridColumn } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';

import { PRODUCT_SERVICE, PRODUCT_BARCODE_SERVICE } from '@inventory/data/inventory-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-barcode',
  imports: [
    FormsModule,
    DynamicCard,
    DataGrid,
    Button,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxColorsModule,
    ToUpperCaseDirective,
  ],
  templateUrl: './product-barcode.component.html',
  styles: ``,
})
export class ProductBarcodeComponent implements OnInit, AfterViewInit {
  private _notification = inject(NotificationService);
  private $productService = inject(PRODUCT_SERVICE);
  private $productBarcodeService = inject(PRODUCT_BARCODE_SERVICE);

  productId = input.required<number>();
  medidas = input<any[]>([]);
  medidasArray = signal<any[]>([]);

  loading = false;

  dataSource = [] as any[];
  columns: DataGridColumn[] = [
    { header: '#', field: 'index', width: '60px', sortable: false },
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Código Barra', field: 'codigoBarra', sortable: true },
    { header: 'Descripción', field: 'descripcion', sortable: true },
    { header: 'Medida', field: 'nomMedida', sortable: true },
    { header: 'Color', field: 'color', sortable: false },
  ];

  productBarCodeId = 0;

  data = model({
    idMedida: 0,
    codigoBarra: null,
    descripcion: '',
    color: null,
  });

  ngOnInit() {
    this.medidasArray.set(this.medidas());
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Templates se asignan automáticamente en acp-data-grid
  }

  loadData() {
    this.loading = true;
    this.$productService
      .getId(this.productId())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => {
        this.dataSource = response.productBarcodes || [];
      });
  }

  // resultModalMedida(result: any) {
  //   try {
  //     if (result && typeof result !== 'object') return;
  //
  //     this.$productDataFormUseCase.execute().subscribe((response) => {
  //       this.medidas.set(response.medidas);
  //       this.infrastructure.idMedida = this.medidas().at(
  //         this.medidas().length - 1
  //       ).idMedida;
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  refreshMedida() {
    try {
      this.$productService.getDataForm().subscribe((response) => {
        this.medidasArray.set(response.medidas);
      });
    } catch (error) {
      console.log(error);
    }
  }

  openColor() {
    const el = document.getElementById('ngx-colors-overlay');

    if (el) {
      el.style.zIndex = '999999';
    }
  }

  clear() {
    this.productBarCodeId = 0;
    this.data.update((item) => {
      return {
        ...item,
        color: null,
      };
    });
  }

  edit(item: any) {
    this.productBarCodeId = item.idArticuloCodigoBarra;
    this.data.set({
      idMedida: item.idMedida,
      color: item.color,
      codigoBarra: item.codigoBarra,
      descripcion: item.descripcion,
    });
  }
  save() {
    if (!getValidId(this.productId())) {
      this._notification.warning({
        message: 'No se ha proporcionado el identificador del producto',
      });
      return;
    }

    if (!getValidId(this.data().idMedida)) {
      this._notification.warning({ message: 'Seleccione la Medida' });
      return;
    }
    if (!isValidField(this.data().codigoBarra)) {
      this._notification.warning({ message: 'Ingrese el Codigo de Barra' });
      return;
    }
    if (!isValidField(this.data().descripcion)) {
      this._notification.warning({ message: 'Ingrese la descripción' });
      return;
    }

    const data = {
      ...this.data(),
      idArticulo: this.productId(),
    };

    if (this.productBarCodeId > 0) {
      this.$productBarcodeService.put(this.productBarCodeId, data).subscribe(this.successResponse);
    } else {
      this.$productBarcodeService.post(data).subscribe(this.successResponse);
    }
  }

  async askToDelete(item: any) {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: `<small>Esta seguro/a de eliminar este Código Barra del Articulo ahora?</small>`,
      showConfirmButton: true,
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      allowOutsideClick: false,
    });

    if (isConfirmed) {
      this.$productBarcodeService
        .remove(item.idArticuloCodigoBarra)
        .subscribe(this.successResponse);
    }
  }
  private successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this._notification.warning({ message: response.message });
      return;
    }
    if (response.code === '1') {
      this._notification.success({ message: response.message });

      this.productBarCodeId = 0;
      this.loadData();
    }
  };
}
