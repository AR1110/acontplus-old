import { Component, input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ImpuestoRetencion } from '@sri/domain/models/impuesto-retencion';
import { CodigoRetencion } from '@sri/domain/models/codigo-retencion';
import { PorcentajeRetIva } from '@modules/sri/domain/models/porcentaje-ret-iva';

@Component({
  selector: 'app-doc-sustento-retencion',
  imports: [ReactiveFormsModule],
  templateUrl: './doc-sustento-retencion.component.html',
  styles: ``,
})
export class DocSustentoRetencionComponent {
  indexDoc = input.required<number>();
  indexRetencion = input.required<number>();
  docSustentoArray = input.required<FormArray>();
  retencionGroup = input.required<any>();
  impuestosRetencion = input.required<ImpuestoRetencion[]>();
  codigosRetencion = input.required<CodigoRetencion[]>();
  porcentajesRetIva = input.required<PorcentajeRetIva[]>();

  setPorcentajesRet(codigo: string, uniqueIdDoc: string) {
    // Logic to set porcentajes based on codigo
    console.log('Selected Codigo:', codigo);
  }
  setPorcentajeRet() {
    // Logic to set porcentaje based on codigo
  }

  setValueRet() {
    // Logic to set value based on input
    const baseImponible = this.retencionGroup().get('baseImponible')?.value;
    const porcentajeRetener =
      this.retencionGroup().get('porcentajeRetener')?.value;
    const valorRetenido = baseImponible * (porcentajeRetener / 100);
    this.retencionGroup().get('valorRetenido')?.setValue(valorRetenido);
  }
}
