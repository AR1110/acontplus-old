import { Component, inject, input, signal, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Button } from '@acontplus/ng-components';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MeasureAddEditDirective } from '@inventory/ui/directives/measure-add-edit.directive';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TabulatorTable } from '@acontplus/ng-components';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { DECIMALS } from '@core/constants/global.constants';
import { getValidId } from '@core/utils/utils';
import { FractionalProductPostUseCase } from '@inventory/product/application/use-cases/fractional-product/fractional-product-post.use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FractionalProductPutUseCase } from '@inventory/product/application/use-cases/fractional-product/fractional-product-put.use-case';
import { FractionalProductGetIdUseCase } from '@inventory/product/application/use-cases/fractional-product/fractional-product-get-id.use-case';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import Swal from 'sweetalert2';
import {
  ProductDataFormUseCase,
  ProductGetIdUseCase,
} from '@inventory/product/application/use-cases/product/get-product.use-case';

@Component({
  selector: 'app-add-edit-fractional-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatListModule,
    MatCustomDialogComponent,
    Button,
    MeasureAddEditDirective,
    TabulatorTable,
  ],
  templateUrl: './add-edit-fractional-product.component.html',
  styles: ``,
})
export class AddEditFractionalProductComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddEditFractionalProductComponent>);
  readonly params = inject<{
    id: number;
    productId: number;
    isCalledFromProductModal: boolean;
  }>(MAT_DIALOG_DATA);

  private $productDataFormUseCase = inject(ProductDataFormUseCase);
  private $productGetIdUseCase = inject(ProductGetIdUseCase);
  private $fractionalProductPostUseCase = inject(FractionalProductPostUseCase);
  private $fractionalProductPutUseCase = inject(FractionalProductPutUseCase);
  private $fractionalProductGetIdUseCase = inject(FractionalProductGetIdUseCase);
  private tS = inject(ToastrNotificationService);

  title = signal('Nuevo Artículo Fraccionado');
  btnText = signal('Guardar');

  medidas = signal<any[]>([]);

  data = {
    idArticulo: 0,
    idMedida: 0,
    precioCosto: 0,
    precioCostoFraccionado: 0,
    conversion: 0,
    gestionVenta: false,
    descripcion: '',
    codigo: '',
    nombreMedida: '',
  };

  columnNames = [
    {
      title: 'Tarifa',
      field: 'nomTarifa',
      headerSort: false,
      width: 140,
      responsive: 0,
    },
    {
      title: 'Tipo Iva',
      field: 'porcentajeIva',
      headerSort: false,
      width: 100,
      responsive: 0,
    },
    {
      title: 'P. Venta',
      field: 'precioVenta',
      headerSort: false,
      editor: 'input',
      validator: ['required', 'min:0', 'numeric'],
      width: 100,
      responsive: 0,
    },
    {
      title: 'P. IVA',
      field: 'precioConIva',
      headerSort: false,

      editor: true,
      validator: ['required', 'min:0', 'numeric'],
      width: 100,
      responsive: 0,
    },
    {
      title: '% Utilidad',
      field: 'porcentajeUtilidad',
      headerSort: false,

      editor: true,
      validator: ['required', 'min:0', 'numeric'],
      width: 100,
      responsive: 0,
    },
    {
      title: 'Utilidad',
      field: 'utilidad',
      headerSort: false,
      width: 100,
      responsive: 0,
    },
    {
      title: 'Estado',
      field: 'nomEstado',
      headerSort: false,
      width: 100,
      responsive: 0,
    },
  ];

  tabulatorOptions = {
    columns: this.columnNames,
    layout: 'fitDataFill',
    reactiveData: true,
    height: null, // Elimina la altura fija para que sea auto
  };

  articuloPrincipalTarifa = signal<any[]>([]);
  productTarifa = signal<any[]>([]);
  tarifas = signal<any[]>([]);
  private decimal = signal({
    nroPrecio: DECIMALS.GENERAL,
  });
  isUpdate() {
    return this.params.id > 0;
  }
  isAdd() {
    return !(this.params.id > 0);
  }

  resultModalMedida(result: any) {
    try {
      if (result && typeof result !== 'object') return;

      this.$productDataFormUseCase.execute().subscribe((response) => {
        this.medidas.set(response.medidas);
        this.data.idMedida = this.medidas().at(this.medidas().length - 1).idMedida;
      });
    } catch (error) {
      console.log(error);
    }
  }
  refreshMedida($event: MouseEvent) {
    $event.stopPropagation();
    try {
      $event.stopPropagation();
      this.$productDataFormUseCase.execute().subscribe((response) => {
        this.medidas.set(response.medidas);
      });
    } catch (error) {
      console.log(error);
    }
  }

  cellEdited(cell: any) {
    const row = cell.getRow();
    const column = cell.getColumn().getField();
    const oldValue = parseFloat(cell.getOldValue());
    const value = parseFloat(cell.getValue());

    const data = cell.getData();
    const precioCosto = this.data.precioCostoFraccionado;
    let precioVenta = parseFloat(data.precioVenta);
    const porcentajeIva = parseFloat(data.porcentajeIva);
    let precioConIva = parseFloat(data.precioConIva);
    let porcentajeUtilidad = parseFloat(data.porcentajeUtilidad);

    if (oldValue === value) {
      return;
    }

    //Validacion de Campos
    if ([null, undefined, '', 0].includes(precioCosto) || isNaN(precioCosto)) {
      cell.setValue(oldValue);
      this.tS.show({
        type: 'warning',
        message: 'Ingrese el precio costo fraccionado',
      });
      return;
    }

    if (column === 'precioVenta' && value > 0) {
      if (value < precioCosto) {
        cell.setValue(oldValue);
      }
    }

    if (column === 'precioConIva' && value > 0) {
      if (value < precioCosto) {
        cell.setValue(oldValue);
      }
    }
    //Calculos
    switch (column) {
      case 'precioVenta':
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeIva);

        porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(
          precioVenta,
          precioCosto,
        );

        break;

      case 'precioConIva':
        precioVenta = pricingCalculateUtil.calculatePriceSale(precioConIva, porcentajeIva);
        porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(
          precioVenta,
          precioCosto,
        );

        break;
      case 'porcentajeUtilidad':
        precioVenta = pricingCalculateUtil.calculatePriceSaleOfValuePercentageUtility(
          precioCosto,
          porcentajeUtilidad,
        );
        precioConIva = pricingCalculateUtil.calculatePriceWithVat(precioVenta, porcentajeIva);
        break;
    }

    const utilidad = pricingCalculateUtil.getValueUtility(precioVenta, precioCosto);

    precioVenta = roundNumber(precioVenta, this.decimal().nroPrecio);
    precioConIva = roundNumber(precioConIva, this.decimal().nroPrecio);

    const obj = {
      precioVenta,
      precioConIva,
      porcentajeUtilidad,
      utilidad,
    };
    row.update({
      ...row,
      ...obj,
    });
  }

  ngOnInit() {
    this.$productDataFormUseCase.execute().subscribe((response) => {
      this.medidas.set(response.medidas);
      this.data.idMedida = this.medidas().length > 0 ? this.medidas()[0].idMedida : 0;

      this.tarifas.set(response.tarifas);

      if (this.isUpdate()) {
        this.title.set('Editar Artículo Fraccionado');
        this.btnText.set('Actualizar');
        this.loadDataUpdate();
      }

      if (this.params.isCalledFromProductModal && this.params.productId > 0) {
        this.selectProduct(this.params.productId);
      }
    });
  }

  private loadDataUpdate() {
    this.$fractionalProductGetIdUseCase.execute(this.params.id).subscribe((response) => {
      if (response.payload) {
        const { data, productPvps } = response.payload;
        this.data = data;
        this.productTarifa.set(productPvps);
      }
    });
  }

  onChangeConversion() {
    if (this.data.conversion > 0) {
      const precioCostoFraccionado = Number(this.data.conversion) * this.data.precioCosto;
      this.data.precioCostoFraccionado = roundNumber(precioCostoFraccionado, 3);
    }
  }

  handleSelectProduct(item: any) {
    this.selectProduct(item.data.idArticulo);
  }

  private selectProduct(idArticulo: number) {
    try {
      this.$productGetIdUseCase.execute(idArticulo).subscribe((response) => {
        this.data = response.data;

        const productoTarifas = structuredClone(response.productPvps);
        this.articuloPrincipalTarifa.set(structuredClone(productoTarifas));

        const productTarifa = structuredClone(productoTarifas).map((item) => {
          item.precioVenta = 0;
          item.precioConIva = 0;
          item.porcentajeUtilidad = 0;
          item.utilidad = 0;
          return item;
        });
        this.productTarifa.set(productTarifa);
      });
    } catch (error) {
      console.log(error);
    }
  }

  recalculateTarifaAdd() {
    if (this.productTarifa().length === 0) return;

    const precioCosto = this.data.precioCostoFraccionado;
    const porcentajeIva = this.productTarifa()[0].porcentajeIva;
    if (!getValidId(precioCosto)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese un número válido',
      });
      return;
    }
    if (precioCosto === 0) {
      this.tS.show({
        type: 'warning',
        message: 'El valor mínimo en el precio de costo es 0.01',
      });
      return;
    }

    try {
      for (const val of this.productTarifa()) {
        val.porcentajeIva = porcentajeIva;

        const precioVenta = pricingCalculateUtil.calculatePriceSale(
          val.precioConIva,
          val.porcentajeIva,
        );
        val.precioVenta = roundNumber(precioVenta, this.decimal().nroPrecio);

        const precioConIva = pricingCalculateUtil.calculatePriceWithVat(
          val.precioVenta,
          val.porcentajeIva,
        );
        val.precioConIva = roundNumber(precioConIva, this.decimal().nroPrecio);

        const porcentajeUtilidad = pricingCalculateUtil.calculateProfitMarginPercentage(
          precioVenta,
          precioCosto,
        );
        val.porcentajeUtilidad = roundNumber(porcentajeUtilidad, DECIMALS.GENERAL);

        const utilidad = pricingCalculateUtil.getValueUtility(val.precioVenta, precioCosto);
        val.utilidad = roundNumber(utilidad, DECIMALS.GENERAL);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async recalculatePercentage($event: MouseEvent) {
    $event.stopPropagation();
    if (!getValidId(this.data.precioCostoFraccionado)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese precio costo fraccionado',
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      html: 'Calcula los precios tomando el valor de porcentaje utilidad del pvp de articulo principal',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Calcular',
      cancelButtonText: 'Cancelar',
    });

    if (!isConfirmed) return;

    const precioCosto = Number(this.data.precioCostoFraccionado);

    const productTarifa = structuredClone(this.productTarifa());
    this.articuloPrincipalTarifa().forEach((item, index) => {
      const precioVenta = pricingCalculateUtil.calculatePriceSaleOfValuePercentageUtility(
        precioCosto,
        item.porcentajeUtilidad,
      );

      const precioConIva = pricingCalculateUtil.calculatePriceWithVat(
        precioVenta,
        item.porcentajeIva,
      );

      productTarifa[index].precioVenta = roundNumber(precioVenta, this.decimal().nroPrecio);
      productTarifa[index].precioConIva = roundNumber(precioConIva, this.decimal().nroPrecio);
      productTarifa[index].porcentajeUtilidad = item.porcentajeUtilidad;
      const utilidad = pricingCalculateUtil.getValueUtility(item.precioVenta, precioCosto);
      productTarifa[index].utilidad = roundNumber(utilidad, DECIMALS.GENERAL);
    });
    this.productTarifa.set(productTarifa);
  }

  save() {
    if (!getValidId(this.data.idArticulo)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione el Articulo',
      });
      return;
    }

    if (!getValidId(this.data.conversion)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese la Conversión',
      });
      return;
    }

    if (isNaN(this.data.conversion)) {
      this.tS.show({
        type: 'warning',
        message: 'Valor no válido en el campo Conversión',
      });
      return;
    }
    if (!getValidId(this.data.idMedida)) {
      this.tS.show({
        type: 'warning',
        message: 'Seleccione la Medida',
      });
      return;
    }
    if (!getValidId(this.data.precioCostoFraccionado)) {
      this.tS.show({
        type: 'warning',
        message: 'Ingrese el Precio Costo Fraccionado',
      });
      return;
    }

    if (isNaN(this.data.precioCostoFraccionado)) {
      this.tS.show({
        type: 'warning',
        message: 'Valor no válido en el campo Precio Costo Fraccionado',
      });
      return;
    }

    const data = {
      id: this.params.id,
      data: structuredClone(this.data),
      pvps: structuredClone(this.productTarifa()),
    };

    if (this.isAdd()) {
      this.$fractionalProductPostUseCase.execute(data).subscribe(this.successResponse);
    }

    if (this.isUpdate()) {
      this.$fractionalProductPutUseCase.execute(data).subscribe(this.successResponse);
    }
  }

  private successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this.tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.tS.show({
        type: 'success',
        message: response.message,
      });
      this.dialogRef.close(response);
    }
  };

  close() {
    this.dialogRef.close();
  }
}
