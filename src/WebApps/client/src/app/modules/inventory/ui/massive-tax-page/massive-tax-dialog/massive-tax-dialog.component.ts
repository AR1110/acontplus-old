import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MASSIVE_TAX_SERVICE } from '@inventory/tokens/inventory-token';
import { finalize } from 'rxjs/operators';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import Swal from 'sweetalert2';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { getValidId, isValidField } from '@core/utils/utils';
import { SubCategoryGroupComponent } from '@inventory/ui/sub-category/components/sub-category-group/sub-category-group.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-massive-tax-dialog',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCustomDialogComponent,
    SubCategoryGroupComponent,
    ToUpperCaseDirective,
  ],
  templateUrl: './massive-tax-dialog.component.html',
  styles: ``,
})
export class MassiveTaxDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MassiveTaxDialogComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);
  private massiveTaxService = inject(MASSIVE_TAX_SERVICE);

  dataForm = {
    title: '0 Productos encontrados.',
    taxIdFrom: 0,
    taxIdTo: 0,
    quantityProducts: 0,
    obs: '',
    subCategoryId: 0,
  };
  private cloneDataForm = structuredClone(this.dataForm);

  taxRatesFrom: TarifaImpuesto[] = [];
  taxRatesTo: TarifaImpuesto[] = [];

  private taxFromDesc = '';
  private taxToDesc = '';
  joinTaxDesc = '';

  loading = signal(false);

  subCategories = [] as any[];

  ngOnInit() {
    this.loading.set(true);
    this.massiveTaxService
      .getDataForm()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.taxRatesFrom = response.taxRates;
        this.subCategories = response.subCategories;
      });
  }

  onChangeTaxFrom() {
    try {
      if (!(this.dataForm.taxIdFrom > 0)) {
        Swal.fire({
          icon: 'warning',
          text: 'Seleccione el Impuesto Inicial',
        });
        return;
      }
      this.taxRatesTo = this.taxRatesFrom.filter(
        (t) => t.idTarifaImpuesto !== this.dataForm.taxIdFrom,
      );
      this.taxFromDesc =
        this.taxRatesFrom.find((t) => t.idTarifaImpuesto === this.dataForm.taxIdFrom)
          ?.descripcion || '';

      this.loading.set(true);
      this.massiveTaxService
        .getQuantityProductByTaxId({
          taxId: this.dataForm.taxIdFrom,
          subCategoryId: this.dataForm.subCategoryId,
        })
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((response) => {
          this.dataForm.quantityProducts = response;
          this.dataForm.title = `${this.dataForm.quantityProducts} Productos encontrados.`;
          this.setTaxDesc();

          if (!(this.dataForm.quantityProducts > 0)) {
            Swal.fire({
              icon: 'info',
              text: 'No se encontraron productos con impuesto inicial.',
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  onChangeTaxTo() {
    this.taxToDesc =
      this.taxRatesTo.find((t) => t.idTarifaImpuesto === this.dataForm.taxIdTo)?.descripcion || '';
    this.setTaxDesc();
  }
  private setTaxDesc() {
    this.joinTaxDesc = `Impuesto Inicial ${this.taxFromDesc} - Impuesto Destino ${this.taxToDesc}`;
  }

  onSelectSubCategory(data: any) {
    this.dataForm.subCategoryId = data;
  }

  clearDataSubCategory() {
    this.dataForm.subCategoryId = 0;
  }

  async askToSave() {
    try {
      if (!(this.dataForm.taxIdFrom > 0)) {
        Swal.fire({
          icon: 'warning',
          text: 'Seleccione el Impuesto Inicial',
        });
        return;
      }

      if (!(this.dataForm.quantityProducts > 0)) {
        Swal.fire({
          icon: 'warning',
          text: 'No se encontraron productos con impuesto inicial.',
        });
        return;
      }

      if (!(this.dataForm.taxIdTo > 0)) {
        Swal.fire({
          icon: 'warning',
          text: 'Seleccione el Impuesto Destino',
        });
        return;
      }

      if (!isValidField(this.dataForm.obs.trim())) {
        Swal.fire({
          icon: 'warning',
          text: 'La observacion es obligatorio.',
        });
        return;
      }

      const obs = `${this.joinTaxDesc} ${this.dataForm.obs}`;

      const { isConfirmed } = await Swal.fire({
        title: 'Actualizar el Impuesto',
        html: `¿Esta seguro de actualizar el impuesto de los ${this.dataForm.quantityProducts} articulos  masivamente? </br>
              <span>
               <strong>Observación: </strong> <h4 class="card-title text-info"> ${obs}</h4>
              </span>
            `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      });

      if (!isConfirmed) return;

      const params = {
        taxIdFrom: this.dataForm.taxIdFrom,
        taxIdTo: this.dataForm.taxIdTo,
        quantity: this.dataForm.quantityProducts,
        obs: obs,
        subCategoryId: getValidId(this.dataForm.subCategoryId),
      };
      // this.loading.set(true);
      this.massiveTaxService
        .put(params)
        //  .pipe(finalize(() => this.loading.set(false)))
        .subscribe((response) => {
          if (response.code === '0') {
            Swal.fire({
              icon: 'warning',
              text: response.message,
            });
          }
          if (response.code === '1') {
            Swal.fire({
              icon: 'success',
              text: response.message,
              timer: 1000,
            });

            setTimeout(() => {
              this.dialogRef.close(response);
            }, 100);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
