import { Component, inject, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomTableContainerComponent } from '@core/components/custom-table-container/custom-table-container.component';
import { ToasterService } from '@core/services/toaster.service';
import { CompraHabitual } from '@purchase/core/domain/compra-habitual.model';
import { CompraHabitualService } from '@purchase/data/services/compra-habitual.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-compra-habitual-historial-modal',
    imports: [
        MatDynamicTableComponent,
        CustomTableContainerComponent,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './compra-habitual-historial-modal.component.html',
    styles: ``
})
export class CompraHabitualHistorialModalComponent {
  private modal = inject(NgbActiveModal)
  private compraHabitualSvc = inject(CompraHabitualService)
  private tS = inject(ToasterService)
  @Input() params = {} as any

  articleName = ''

  comprasHabituales = signal<CompraHabitual[]>([])

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
    console.log(this.params)
    this.articleName = `${this.params.codigo} -> ${this.params.descripcion}`;
    this.getComprasHabituales()
  }

  private getComprasHabituales() {
    this.isLoadingResults = true;
    this.compraHabitualSvc.get({
      tipo: 1,
      idArticulo: this.params.idArticulo
    }).subscribe({
      next: response => {
        this.isLoadingResults = false;
        this.comprasHabituales.set(response.comprasHabituales)
        if (this.comprasHabituales().length > 0) {
          this.articleName = this.comprasHabituales()[0].articulo;
        } else {
          this.tS.toastr({
            type: 'warning',
            message: 'Este articulo aun no tiene registros de compra habitual'
          })
        }
      },
      error: () => {
        this.isLoadingResults = false;

      }
    })
  }



  askToDeleteCH(item: any) {
    Swal.fire({
      title: '¿Está seguro/a de desvincular este articulo de compras habituales?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCH(item);
      }
    })
  }



  private deleteCH(item: any) {
    try {
      const { idDocumento, idCompraHabitual } = Object.assign(item, { idDocumento: this.params.idDocumento });
      let params = { idDocumento, id: idCompraHabitual }

      this.compraHabitualSvc.delete(params).subscribe(response => {
        if (response.code === "0") {
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }

        if (response.code === "1") {
          this.tS.toastr({
            type: 'success',
            message: response.message
          })
          this.isRefresh = true;
          this.closeModal()
        }
      })

    } catch (error) {
      console.log(error)
    }
  }


  closeModal() {
    this.modal.close({
      isRefresh: this.isRefresh
    })
  }
}
