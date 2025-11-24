import { Component, inject, input, model, output, OnInit } from '@angular/core';
import { DynamicCard } from '@acontplus/ng-components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { ProductUbicationPostUseCase } from '@inventory/product/application/use-cases/product-ubication/product-ubication-post.use-case';
import { ProductUbicationPutUseCase } from '@inventory/product/application/use-cases/product-ubication/product-ubication-put.use-case';
import { getValidId, isValidField } from '@core/utils/utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ProductUbicationRemoveUseCase } from '@inventory/product/application/use-cases/product-ubication/product-ubication-remove.use-case';
import { ProductGetIdUseCase } from '@inventory/product/application/use-cases/product/get-product.use-case';

@Component({
  selector: 'app-product-ubication',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    DynamicCard,
    MatDynamicTableComponent,
    ToUpperCaseDirective,
  ],
  templateUrl: './product-ubication.component.html',
  styles: ``,
})
export class ProductUbicationComponent implements OnInit {
  private _tS = inject(ToastrNotificationService);
  private $productGetIdUseCase = inject(ProductGetIdUseCase);
  private $productUbicationPosUseCase = inject(ProductUbicationPostUseCase);
  private $productUbicationPutUseCase = inject(ProductUbicationPutUseCase);
  private $productUbicationRemoveUseCase = inject(ProductUbicationRemoveUseCase);

  productId = input.required<number>();
  idEstablecimiento = input(0);
  idBodega = input(0);
  estabs = input<GroupedEstab[]>([]);
  bodegas = input<GroupedEstabBodega[]>([]);

  loading = false;

  dataSource = new MatTableDataSource<any>([]);
  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nomBodega', label: 'Bodega', type: 'string' },
    { key: 'ubicacion', label: 'Ubicación', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  productUbicationId = 0;

  data = model({
    idEstablecimiento: 0,
    idBodega: 0,
    ubicacion: null,
  });

  onChangeEstab = output();

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.$productGetIdUseCase
      .execute(this.productId())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource(response?.productLocations || []);
      });
  }

  clear() {
    this.productUbicationId = 0;
    this.data.update((item) => {
      return {
        ...item,
        ubicacion: null,
      };
    });
    console.log(this.data());
  }

  edit(item: any) {
    const dataBodega = this.bodegas().find((bodega) => bodega.idBodega === item.idBodega);

    if (dataBodega) {
      const dataEstab = this.estabs().find(
        (estab) => estab.idEstablecimiento === dataBodega.idEstablecimiento,
      );

      this.productUbicationId = item.idArticuloUbicacion;
      this.data.set({
        idEstablecimiento: dataEstab?.idEstablecimiento || 0,
        idBodega: dataBodega.idBodega,
        ubicacion: item.ubicacion,
      });
    }
  }
  save() {
    if (!getValidId(this.productId())) {
      this._tS.show({
        type: 'warning',
        message: 'No se ha proporcionado el identificador del producto',
      });
      return;
    }
    if (!getValidId(this.data().idEstablecimiento)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione el Establecimiento',
      });
      return;
    }

    if (!getValidId(this.data().idBodega)) {
      this._tS.show({
        type: 'warning',
        message: 'Seleccione la Bodega',
      });
      return;
    }

    if (!isValidField(this.data().ubicacion)) {
      this._tS.show({
        type: 'warning',
        message: 'Ingrese la ubicación',
      });
      return;
    }

    const data = {
      ...this.data(),
      idArticulo: this.productId(),
    };

    if (this.productUbicationId > 0) {
      this.$productUbicationPutUseCase
        .execute({
          id: this.productUbicationId,
          data,
        })
        .subscribe(this.successResponse);
    } else {
      this.$productUbicationPosUseCase.execute(data).subscribe(this.successResponse);
    }

    console.log(this.data());
  }

  async askToDelete(item: any) {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: `<small>Esta seguro/a de eliminar este Ubicación del Articulo ahora?</small>`,
      showConfirmButton: true,
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      allowOutsideClick: false,
    });

    if (isConfirmed) {
      this.$productUbicationRemoveUseCase
        .execute(item.idArticuloUbicacion)
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

      this.productUbicationId = 0;
      this.loadData();
    }
  };
}
