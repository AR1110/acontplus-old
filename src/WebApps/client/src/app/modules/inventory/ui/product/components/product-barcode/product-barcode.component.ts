import {
  Component,
  inject,
  input,
  model,
  signal,
  TemplateRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { finalize } from 'rxjs/operators';
import { getValidId, isValidField } from '@core/utils/utils';
import Swal from 'sweetalert2';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { NgxColorsModule } from 'ngx-colors';
import { DynamicCard } from '@acontplus/ng-components';

import { MECHANICAL_STATUS } from '@mechanical/domain/enums/mechanical.enum';
import { PRODUCT_SERVICE, PRODUCT_BARCODE_SERVICE } from '@inventory/tokens/inventory-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-barcode',
  imports: [
    FormsModule,
    DynamicCard,
    MatDynamicTableComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgxColorsModule,
    ToUpperCaseDirective,
    MatIconButton,
  ],
  templateUrl: './product-barcode.component.html',
  styles: ``,
})
export class ProductBarcodeComponent implements OnInit, AfterViewInit {
  private _tS = inject(ToastrNotificationService);
  private $productService = inject(PRODUCT_SERVICE);
  private $productBarcodeService = inject(PRODUCT_BARCODE_SERVICE);

  @ViewChild('colorTemplate') colorTemplate!: TemplateRef<any>;

  productId = input.required<number>();
  medidas = input<any[]>([]);
  medidasArray = signal<any[]>([]);

  loading = false;

  dataSource = [] as any[];
  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'codigoBarra', label: 'Código Barra', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'nomMedida', label: 'Medida', type: 'string' },
    { key: 'color', label: 'Color', type: 'template' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

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
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.colorTemplate;
      }
    });
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
  refreshMedida($event: MouseEvent) {
    try {
      $event.stopPropagation();
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
      this._tS.show({
        type: 'warning',
        message: 'No se ha proporcionado el identificador del producto',
      });
      return;
    }

    if (!getValidId(this.data().idMedida)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione la Medida',
      });
      return;
    }
    if (!isValidField(this.data().codigoBarra)) {
      this._tS.show({
        type: 'warning',
        message: 'Ingrese el Codigo de Barra',
      });
      return;
    }
    if (!isValidField(this.data().descripcion)) {
      this._tS.show({
        type: 'warning',
        message: 'Ingrese la descripción',
      });
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
      this._tS.show({
        type: 'warning',
        message: response.message,
      });
      return;
    }
    if (response.code === '1') {
      this._tS.show({
        type: 'success',
        message: response.message,
      });

      this.productBarCodeId = 0;
      this.loadData();
    }
  };
  protected readonly statusTab = MECHANICAL_STATUS;
}
