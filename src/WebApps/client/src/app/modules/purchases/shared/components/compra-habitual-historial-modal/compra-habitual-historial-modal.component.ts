import { Component, inject, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { CompraHabitual } from '@purchases/data/models/compra-habitual.model';
import { CompraHabitualService } from '@purchases/services/compra-habitual.service';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import Swal from 'sweetalert2';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

@Component({
  selector: 'app-compra-habitual-historial-modal',
  imports: [
    MatDynamicTableComponent,
    CustomTableContainerComponent,
    MatIconModule,
    MatButtonModule,
    MatCustomDialogComponent,
  ],
  templateUrl: './compra-habitual-historial-modal.component.html',
  styles: ``,
})
export class CompraHabitualHistorialModalComponent implements OnInit {
  private modal = inject(MatDialogRef<CompraHabitualHistorialModalComponent>);
  private compraHabitualSvc = inject(CompraHabitualService);
  private tS = inject(ToastrNotificationService);
  params = inject(MAT_DIALOG_DATA);

  articleName = '';

  comprasHabituales = signal<CompraHabitual[]>([]);

  documentos: any[] = [];

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'codArticulo', label: 'Código Proveedor', type: 'string' },
    { key: 'ruc', label: 'Ruc', type: 'string' },
    { key: 'proveedor', label: 'Proveedor', type: 'string' },
  ];
  columns: string[] = ['index', 'op', 'codArticulo', 'ruc', 'proveedor'];
  isLoadingResults = false;

  isRefresh = false;

  ngOnInit() {
    console.log(this.params);
    this.articleName = `${this.params.codigo} -> ${this.params.descripcion}`;
    this.getComprasHabituales();
  }

  private getComprasHabituales() {
    this.isLoadingResults = true;
    this.compraHabitualSvc
      .get({
        tipo: 1,
        idArticulo: this.params.idArticulo,
      })
      .subscribe({
        next: (response) => {
          this.isLoadingResults = false;
          this.comprasHabituales.set(response.comprasHabituales);
          if (this.comprasHabituales().length > 0) {
            this.articleName = this.comprasHabituales()[0].articulo;
          } else {
            this.tS.show({
              type: 'warning',
              message: 'Este articulo aun no tiene registros de compra habitual',
            });
          }
        },
        error: () => {
          this.isLoadingResults = false;
        },
      });
  }

  askToDeleteCH(item: any) {
    Swal.fire({
      title: '¿Está seguro/a de desvincular este articulo de compras habituales?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCH(item);
      }
    });
  }

  private deleteCH(item: any) {
    try {
      const { idDocumento, idCompraHabitual } = Object.assign(item, {
        idDocumento: this.params.idDocumento,
      });
      const params = { idDocumento, id: idCompraHabitual };

      this.compraHabitualSvc.delete(params).subscribe((response) => {
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
          this.isRefresh = true;
          this.onModalClose();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onModalClose() {
    this.modal.close({
      isRefresh: this.isRefresh,
    });
  }
}
