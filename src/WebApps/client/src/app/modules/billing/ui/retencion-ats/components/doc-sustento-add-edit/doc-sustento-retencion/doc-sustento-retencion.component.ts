import { DocSustentoRetencionUseCase } from '@billing/domain/use-cases/retencion-ats/doc-sustento-retencion.use-case';
import { NgDynamicSelectComponent } from '@shared/components/ng-dynamic-select/ng-dynamic-select.component';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { PorcentajeRetencionIva } from '@sri/domain/models/porcentaje-retencion-iva';
import { ConceptoRetencionAir } from '@sri/domain/models/concepto-retencion-air';
import { ImpuestoRetencion } from '@sri/domain/models/impuesto-retencion';
import { Component, inject, input, signal } from '@angular/core';
import { SelectOption } from '@shared/models/select-option';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doc-sustento-retencion',
  imports: [
    ReactiveFormsModule,
    NgDynamicSelectComponent,
    MatFormField,
    MatSelectModule,
    MatInput,
    ThemeButtonComponent,
  ],
  templateUrl: './doc-sustento-retencion.component.html',
  styles: ``,
})
export class DocSustentoRetencionComponent {
  indexDoc = input.required<number>();
  indexRetencion = input.required<number>();
  docSustentoArray = input.required<FormArray>();
  retencionGroup = input.required<AbstractControl>();
  impuestosRetencion = input.required<ImpuestoRetencion[]>();
  codigosRetencion = input.required<ConceptoRetencionAir[]>();
  porcentajesRetIva = input.required<PorcentajeRetencionIva[]>();

  options = signal<SelectOption[]>([]);

  codImpuestoRetencionSelected = signal<string>('');

  private readonly _docSustentoRetencionUseCase = inject(DocSustentoRetencionUseCase);
  private readonly _tS = inject(ToastrNotificationService);

  get formGroup(): FormGroup {
    return this.retencionGroup() as FormGroup;
  }

  selectCodigoRetencion(codigo: string | number | null) {
    if (!codigo) return;

    setTimeout(() => {
      this.formGroup.get('codigoRetencion')?.setValue(codigo);

      if (this.codImpuestoRetencionSelected() === '1') {
        const porcentaje = this.codigosRetencion().filter(x => x.codigo === codigo)[0]?.porcentaje;
        if (porcentaje !== undefined) {
          this.formGroup.get('porcentajeRetener')?.setValue(porcentaje);
        }
      }
      if (this.codImpuestoRetencionSelected() === '2') {
        const porcentaje = this.porcentajesRetIva().filter(x => x.codigo === codigo)[0]?.porcentaje;
        if (porcentaje !== undefined) {
          this.formGroup.get('porcentajeRetener')?.setValue(porcentaje);
        }
      }

      this.calcularRetencion();
    });
  }
  setBaseImponible(codigo: string) {
    const baseImponibleControl = this.formGroup.get('baseImponible');

    const docGroup = this.docSustentoArray().at(this.indexDoc());

    let taxValue = 0;
    if (codigo === '2') {
      const taxesArray = docGroup.get('taxes') as FormArray;

      for (let i = 0; i < taxesArray.length; i++) {
        const taxItem = taxesArray.at(i).value;
        if (taxItem.codigo === '2') {
          taxValue = taxItem.valorImpuesto;
          break;
        }
      }
    }
    setTimeout(() => {
      switch (codigo) {
        case '1':
          baseImponibleControl?.setValue(docGroup.get('totalSinImpuestos')?.value);
          break;
        case '2':
          baseImponibleControl?.setValue(taxValue);
          break;
        default:
          break;
      }
    });
  }

  selectImpuestoRetencion(idImpuestoRetencion: number) {
    // Logic to set porcentajes based on codigo
    const codigo = this.impuestosRetencion().filter(x => x.id === idImpuestoRetencion)[0].codigo;

    this.codImpuestoRetencionSelected.set(codigo);

    this.options.set([]);

    if (codigo === '1') {
      const retRentaValues = [...this.codigosRetencion()]; // Create a shallow copy
      this.options.set(
        retRentaValues.map(ret => ({
          value: ret.codigo,
          viewValue: `${ret.codigo} - ${ret.descripcion}`,
        })),
      );
    }

    if (codigo === '2') {
      const retIvaValues = [...this.porcentajesRetIva()]; // Create a shallow copy

      this.options.set(
        retIvaValues.map(ret => ({
          value: ret.codigo,
          viewValue: `${ret.codigo} - ${ret.descripcion}`,
        })),
      );
    }

    setTimeout(() => {
      switch (codigo) {
        case '1':
          this.setBaseImponible(codigo);
          break;
        case '2':
          this.setBaseImponible(codigo);
          this.options().map((x, index) => {
            return {
              ...x,
              value: this.porcentajesRetIva()[index % this.porcentajesRetIva().length],
            };
          });
          break;
        default:
          break;
      }
    });
  }

  calcularRetencion() {
    setTimeout(() => {
      const baseImponible = this.formGroup.get('baseImponible')?.value;
      const porcentajeRetener = this.formGroup.get('porcentajeRetener')?.value;
      const valorRetenido = baseImponible * (porcentajeRetener / 100);
      this.formGroup.get('valorRetenido')?.setValue(valorRetenido.toFixed(2));
    });
  }

  async removeRetencion() {
    const retenciones = this.docSustentoArray().at(this.indexDoc()).get('retenciones') as FormArray;

    const retencionSelected = retenciones.controls[this.indexRetencion()].value;

    if (retencionSelected.idRetencionAtsRet > 0) {
      const { isConfirmed } = await Swal.fire({
        title: 'Eliminar Retencion',
        icon: 'warning',
        text: `Esta seguro(a) de eliminar esta retención, de manera permanente?`,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      });
      if (isConfirmed) {
        this._docSustentoRetencionUseCase
          .delete(retencionSelected.idRetencionAtsRet)
          .subscribe(response => {
            this._tS.show({
              type: response.code === '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code === '1') {
              this.removeByIndex();
            }
          });
      }
    } else {
      await this.removeByIndex();
    }
  }

  async removeByIndex() {
    const retenciones = this.docSustentoArray().at(this.indexDoc()).get('retenciones') as FormArray;

    if (this.indexRetencion() >= 0 && this.indexRetencion() < retenciones.length) {
      retenciones.removeAt(this.indexRetencion());
    }
  }

  onSave() {
    const retenciones = this.docSustentoArray().at(this.indexDoc()).get('retenciones') as FormArray;

    const retencionSelected = retenciones.controls[this.indexRetencion()].value;

    if (retencionSelected.idRetencionAtsRet > 0) {
      this._docSustentoRetencionUseCase
        .update(retencionSelected.idRetencionAtsRet, retencionSelected)
        .subscribe(response => {
          this._tS.show({
            type: response.code === '1' ? 'success' : 'warning',
            message: response.message,
          });
        });
    } else {
      this._docSustentoRetencionUseCase.create(retencionSelected).subscribe(response => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
      });
    }
  }
}
