import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '@acontplus/ng-components';
import { MASSIVE_TAX_SERVICE } from '@inventory/data/inventory-token';
import { finalize } from 'rxjs/operators';
import { TarifaImpuesto } from '@shared/models/tarifa-impuesto.model';
import Swal from 'sweetalert2';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { getValidId, isValidField } from '@core/utils/utils';
import { SubCategoryGroup } from '@inventory/ui/sub-category/components/sub-category-group/sub-category-group';
import { NotificationService } from '@acontplus/ng-notifications';

interface MassiveTaxFormData {
  title: string;
  taxIdFrom: number;
  taxIdTo: number;
  quantityProducts: number;
  obs: string;
  subCategoryId: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-massive-tax-add',
  templateUrl: './massive-tax-add.html',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    Button,
    SubCategoryGroup,
    ToUpperCaseDirective,
    MatDialogActions,
    MatDialogContent,
  ],
})
export class MassiveTaxAdd implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MassiveTaxAdd>);
  readonly params = inject<unknown>(MAT_DIALOG_DATA);

  private massiveTaxService = inject(MASSIVE_TAX_SERVICE);
  private tS = inject(NotificationService);

  dataForm: MassiveTaxFormData = {
    title: '0 Productos encontrados.',
    taxIdFrom: 0,
    taxIdTo: 0,
    quantityProducts: 0,
    obs: '',
    subCategoryId: 0,
  };

  taxRatesFrom = signal<TarifaImpuesto[]>([]);
  taxRatesTo = signal<TarifaImpuesto[]>([]);
  subCategories = signal<any[]>([]);

  private taxFromDesc = signal('');
  private taxToDesc = signal('');
  joinTaxDesc = signal('');

  loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.massiveTaxService
      .getDataForm()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response: { taxRates: TarifaImpuesto[]; subCategories: unknown[] }) => {
        this.taxRatesFrom.set(response.taxRates);
        this.subCategories.set(response.subCategories);
      });
  }

  onChangeTaxFrom(): void {
    try {
      if (!(this.dataForm.taxIdFrom > 0)) {
        this.tS.warning({ message: 'Seleccione el Impuesto Inicial' });
        return;
      }
      this.taxRatesTo.set(
        this.taxRatesFrom().filter((t) => t.idTarifaImpuesto !== this.dataForm.taxIdFrom),
      );
      this.taxFromDesc.set(
        this.taxRatesFrom().find((t) => t.idTarifaImpuesto === this.dataForm.taxIdFrom)
          ?.descripcion ?? '',
      );

      this.loading.set(true);
      this.massiveTaxService
        .getQuantityProductByTaxId({
          taxId: this.dataForm.taxIdFrom,
          subCategoryId: this.dataForm.subCategoryId,
        })
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((response: number) => {
          this.dataForm.quantityProducts = response;
          this.dataForm.title = `${this.dataForm.quantityProducts} Productos encontrados.`;
          this.setTaxDesc();

          if (!(this.dataForm.quantityProducts > 0)) {
            this.tS.info({ message: 'No se encontraron productos con impuesto inicial.' });
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  onChangeTaxTo(): void {
    this.taxToDesc.set(
      this.taxRatesTo().find((t) => t.idTarifaImpuesto === this.dataForm.taxIdTo)?.descripcion ??
        '',
    );
    this.setTaxDesc();
  }

  private setTaxDesc(): void {
    this.joinTaxDesc.set(
      `Impuesto Inicial ${this.taxFromDesc()} - Impuesto Destino ${this.taxToDesc()}`,
    );
  }

  onSelectSubCategory(data: number): void {
    this.dataForm.subCategoryId = data;
  }

  clearDataSubCategory(): void {
    this.dataForm.subCategoryId = 0;
  }

  async askToSave(): Promise<void> {
    try {
      if (!(this.dataForm.taxIdFrom > 0)) {
        this.tS.warning({ message: 'Seleccione el Impuesto Inicial' });
        return;
      }

      if (!(this.dataForm.quantityProducts > 0)) {
        this.tS.warning({ message: 'No se encontraron productos con impuesto inicial.' });
        return;
      }

      if (!(this.dataForm.taxIdTo > 0)) {
        this.tS.warning({ message: 'Seleccione el Impuesto Destino' });
        return;
      }

      if (!isValidField(this.dataForm.obs.trim())) {
        this.tS.warning({ message: 'La observación es obligatoria.' });
        return;
      }

      const obs = `${this.joinTaxDesc()} ${this.dataForm.obs}`;

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

      this.loading.set(true);
      this.massiveTaxService
        .put(params)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe((response: { code: string; message: string }) => {
          if (response.code === '0') {
            this.tS.warning({ message: response.message });
          }
          if (response.code === '1') {
            this.tS.success({ message: response.message });
            setTimeout(() => {
              this.dialogRef.close(response);
            }, 100);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }
}
