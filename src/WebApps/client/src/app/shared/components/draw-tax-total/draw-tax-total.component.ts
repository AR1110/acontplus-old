import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-draw-tax-total',
    imports: [],
    templateUrl: './draw-tax-total.component.html',
    styles: ``
})
export class DrawTaxTotalComponent {
  @Input() subTotalSinImpuesto = 0;
  @Input() htmlImpuestoTotal = ''
  @Input() discount = 0;
  @Input() totalIce= 0;
  @Input() irbpnr = 0;
  @Input() htmlIvaTotal= '';
  @Input() importeTotal= 0;




  ngOnChanges(changes: SimpleChanges) {
      // Si el valor de htmlString cambió, actualiza el contenido
      this.updateContent();
  }

  updateContent() {
    // Actualiza el contenido HTML
    const element = document.getElementById('htmlStringTaxTotals');
    let htmlString = `<div class="table-responsive">
                                        <table class="table table-clear table-sm">
                                            <tbody>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Subtotal sin Impuestos</span>
                                                    </td>
                                                    <td class="right">$${this.subTotalSinImpuesto}</td>
                                                </tr>
                                                ${this.htmlImpuestoTotal}
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Total descuento</span>
                                                    </td>
                                                    <td class="right">$${this.discount}</td>
                                                </tr>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Valor ICE</span>
                                                    </td>
                                                    <td class="right">$${this.totalIce}</td>
                                                </tr>
                                                <tr>
                                                    <td class="left">
                                                        <span class="text-dark">Valor irbpnr</span>
                                                    </td>
                                                    <td class="right">$${this.irbpnr}</td>
                                                </tr>
                                                ${this.htmlIvaTotal}

                                                <tr>
                                                    <td class="left">
                                                        <strong class="font-weight-bold">Valor Total</strong>
                                                    </td>
                                                    <td class="right font-weight-bold">$${this.importeTotal}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                `;

    if (element) {
      element.innerHTML = htmlString;
    }
  }

}
