import { CustomContainerDialogComponent } from '@/shared/components/custom-container-dialog/custom-container-dialog.component';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { TarifaProducto } from '@/shared/models/inventory/tarifa.model';
import { MedidaProducto } from '@/shared/models/inventory/medida.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaxRate } from '@/shared/models/tax.model';
import { pricingCalculateUtil } from '@/shared/utils/princing-calculate.util';
import { roundNumber } from '@/shared/utils/round-number.util';
import { ToUpperCaseDirective } from '@/shared/directives/to-upper-case.directive';
import { OrderItem } from '@/features/orders/models/order.interface';
import { DECIMALS } from '@/shared/enums/main.enum';

@Component({
    selector: 'app-cart-info',
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        CustomContainerDialogComponent,
        ToUpperCaseDirective
    ],
    templateUrl: './cart-info.component.html',
    styles: `
  .img-cart {
  background: rgba(0, 0, 0, 0.2);
  width: 100%; /* Make image responsive to the container */
  max-width: 100px; /* Limit the maximum size of the image */
  height: 100px; /* Maintain aspect ratio */
  border-radius: 20%; /* Make the image circular */
  object-fit: cover; /* Cover the container while preserving aspect ratio */
}

  `
})
export class CartInfoComponent {

  readonly dialogRef = inject(MatDialogRef<CartInfoComponent>);
  readonly params = inject<{ data: OrderItem, taxRates: TaxRate[] }>(MAT_DIALOG_DATA);

  data = this.params.data;
  tarifas: TarifaProducto[] = [];
  medidas: MedidaProducto[] = [];
  taxRates: TaxRate[] = []

  ngOnInit() {
    this.tarifas = this.data.pvps;
    this.medidas = this.data.medidas;
    this.taxRates = this.params.taxRates;
  }

  valueChangeMedida() {
    let dataMedida = this.medidas.find(m => m.idMedida === this.data.medidaId);
    if (dataMedida) {
      const dataTarifa = dataMedida?.pvps.find(pvp => (pvp.default));

      this.data.conversion = dataMedida.conversion;
      this.data.pvps = dataMedida?.pvps || [];
      this.data.cost = dataMedida.precioCosto;
      this.data.costoFraccionado = dataMedida.precioCostoFraccionado;
      this.data.feeId = dataTarifa?.idTarifa ?? 0;
      this.data.price = dataTarifa?.precioVenta ?? 0;
      this.data.precioConIva = dataTarifa?.precioConIva ?? 0;
      this.setCalculateTotal()
    }
  }

  valueChangeTarifa() {
    const dataTarifa = this.tarifas.find(pvp => pvp.idTarifa === this.data.feeId);
    if (dataTarifa) {
      this.data.price = dataTarifa?.precioVenta ?? 0;
      this.data.precioConIva = dataTarifa?.precioConIva ?? 0;
      this.setCalculateTotal()
    }

  }

  setCalculateTotal() {
    let subtotalSinImpuesto = pricingCalculateUtil.calcularSubtotalSinImpuesto(this.data.price, this.data.quantity, this.data.discount);
    this.data.taxValue = pricingCalculateUtil.calculateTaxValue(subtotalSinImpuesto, this.data.taxPercent);
    let total = pricingCalculateUtil.calcularTotalConImpuesto(subtotalSinImpuesto, this.data.taxValue);

    this.data.precioTotalSinImpuesto = roundNumber(subtotalSinImpuesto, DECIMALS.GENERAL)
    this.data.total = roundNumber(total, DECIMALS.GENERAL);
  }

  changeApply() {
    this.dialogRef.close(this.data)
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
