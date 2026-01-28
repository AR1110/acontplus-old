import {
  Component,
  inject,
  input,
  model,
  output,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { DynamicCard, DataGrid, Button, DataGridColumn } from '@acontplus/ng-components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { MatIconModule } from '@angular/material/icon';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { NotificationService } from '@acontplus/ng-notifications';

import { getValidId, isValidField } from '@core/utils/utils';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { PRODUCT_SERVICE, PRODUCT_UBICATION_SERVICE } from '@inventory/data/inventory-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-ubication',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    DynamicCard,
    DataGrid,
    Button,
    ToUpperCaseDirective,
  ],
  templateUrl: './product-ubication.component.html',
  styles: ``,
})
export class ProductUbicationComponent implements OnInit {
  private _notification = inject(NotificationService);
  private $productService = inject(PRODUCT_SERVICE);
  private $productUbicationService = inject(PRODUCT_UBICATION_SERVICE);

  productId = input.required<number>();
  idEstablecimiento = input(0);
  idBodega = input(0);
  estabs = input<GroupedEstab[]>([]);
  bodegas = input<GroupedEstabBodega[]>([]);

  loading = false;

  dataSource = signal<any>([]);
  columns: DataGridColumn[] = [
    { header: '#', field: 'index', width: '60px', sortable: false },
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Bodega', field: 'nomBodega', sortable: true },
    { header: 'Ubicación', field: 'ubicacion', sortable: true },
  ];

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
    this.$productService
      .getId(this.productId())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => {
        this.dataSource.set(response?.productLocations || []);
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
      this._notification.warning({
        message: 'No se ha proporcionado el identificador del producto',
      });
      return;
    }
    if (!getValidId(this.data().idEstablecimiento)) {
      this._notification.warning({ message: 'Seleccione el Establecimiento' });
      return;
    }

    if (!getValidId(this.data().idBodega)) {
      this._notification.warning({ message: 'Seleccione la Bodega' });
      return;
    }

    if (!isValidField(this.data().ubicacion)) {
      this._notification.warning({ message: 'Ingrese la ubicación' });
      return;
    }

    const data = {
      ...this.data(),
      idArticulo: this.productId(),
    };

    if (this.productUbicationId > 0) {
      this.$productUbicationService
        .put(this.productUbicationId, data)
        .subscribe(this.successResponse);
    } else {
      this.$productUbicationService.post(data).subscribe(this.successResponse);
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
      this.$productUbicationService
        .remove(item.idArticuloUbicacion)
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

      this.productUbicationId = 0;
      this.loadData();
    }
  };
}
