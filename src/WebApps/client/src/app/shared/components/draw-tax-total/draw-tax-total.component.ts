import { Component, signal, effect, input, ChangeDetectionStrategy } from '@angular/core';
import { DynamicCard } from '@acontplus/ng-components';

@Component({
  selector: 'app-draw-tax-total',
  imports: [DynamicCard],
  templateUrl: './draw-tax-total.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawTaxTotalComponent {
  subTotalSinImpuesto = input(0);
  htmlImpuestoTotal = input('');
  discount = input(0);
  totalIce = input(0);
  irbpnr = input(0);
  htmlIvaTotal = input('');
  importeTotal = input(0);

  htmlString = signal('');

  constructor() {
    effect(() => {
      this.updateContent();
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   this.updateContent();
  // }

  updateContent() {
    const htmlString = `<div class="table-responsive">
                                        <table class="table table-clear table-sm">
                                            <tbody>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Subtotal sin Impuestos</span>
                                                    </td>
                                                    <td class="right">$${this.subTotalSinImpuesto()}</td>
                                                </tr>
                                                ${this.htmlImpuestoTotal()}
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Total descuento</span>
                                                    </td>
                                                    <td class="right">$${this.discount()}</td>
                                                </tr>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Valor ICE</span>
                                                    </td>
                                                    <td class="right">$${this.totalIce()}</td>
                                                </tr>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Valor irbpnr</span>
                                                    </td>
                                                    <td class="right">$${this.irbpnr()}</td>
                                                </tr>
                                                ${this.htmlIvaTotal()}

                                                <tr>
                                                    <td class="left">
                                                        <strong class="font-weight-bold">Valor Total</strong>
                                                    </td>
                                                    <td class="right font-weight-bold">$${this.importeTotal()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                `;

    this.htmlString.set(htmlString);
  }
}
