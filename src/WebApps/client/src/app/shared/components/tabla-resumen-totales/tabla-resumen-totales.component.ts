import { Component, computed, effect, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { TotalizadorUtil } from '@core/utils/totalizador.util';

@Component({
  selector: 'app-tabla-resumen-totales',
  template: `<div [innerHTML]="htmlContentTotals()"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaResumenTotalesComponent {
  // Use input to get details and tax rates as signals
  detalles = input<any[]>([]);
  tarifasImpuesto = input<any[]>([]);

  // Signal to hold HTML content for totals
  htmlContentTotals = computed(() => {
    const obj = {
      items: this.detalles(),
      tarifasImpuesto: this.tarifasImpuesto(),
    };

    // Calculate totals using the utility function
    const newTotalizadorUtil = new TotalizadorUtil();
    newTotalizadorUtil.calcular(obj);

    // Update the signal with the new totals HTML
    return newTotalizadorUtil.htmlTotales;
  });
}
