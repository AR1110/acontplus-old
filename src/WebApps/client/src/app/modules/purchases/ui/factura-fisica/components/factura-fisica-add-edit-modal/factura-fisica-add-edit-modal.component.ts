import { Component, inject, model, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { FacturaFisicaService } from '@purchases/services/factura-fisica.service';
import { finalize } from 'rxjs';
import { GroupedEstab, GroupedEstabBodega } from '@core/models/estab.model';
import { FormsModule } from '@angular/forms';
import { SupplierSearchComponent } from '@customer/ui/supplier/components/supplier-search/supplier-search.component';

@Component({
  selector: 'app-factura-fisica-add-edit-modal',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCustomDialogComponent,
    SupplierSearchComponent,
  ],
  templateUrl: './factura-fisica-add-edit-modal.component.html',
  styles: ``,
})
export class FacturaFisicaAddEditModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<FacturaFisicaAddEditModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private facturaFisicaSvc = inject(FacturaFisicaService);

  icon = signal('add');

  title = signal('Nueva Factura Física');

  loading = signal(false);

  dataForm = model({
    idEstablecimiento: 0,
    idBodega: 0,
  });

  dataFormClone = model(structuredClone(this.dataForm()));

  estabs = signal<GroupedEstab[]>([]);
  sustentosTributario = signal<any[]>([]);
  bodegas = signal<GroupedEstabBodega[]>([]);

  setDataForm<K extends keyof ReturnType<typeof this.dataForm>>(
    key: K,
    value: ReturnType<typeof this.dataForm>[K],
  ) {
    this.dataForm.update((ds) => {
      return {
        ...ds,
        [key]: value,
      };
    });
  }

  ngOnInit() {
    this.loading.set(true);
    this.facturaFisicaSvc
      .getDataForm()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.sustentosTributario.set(response.sustentosTributario);
        this.estabs.set(response.estabs);

        const dataEstab = this.estabs().find((item) => item.defaultEstab);

        this.bodegas.set(dataEstab?.bodegas || []);

        this.setDataForm('idEstablecimiento', dataEstab?.idEstablecimiento || 0);
      });
  }

  close() {
    this.dialogRef.close();
  }
}
