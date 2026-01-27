import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DataGrid, Button, DataGridColumn } from '@acontplus/ng-components';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-hist-purchase-modal',
  imports: [
    DataGrid,
    Button,
    MatIconModule,
    MatDialogContent,
  ],
  templateUrl: './product-hist-purchase-modal.component.html',
  styles: ``,
})
export class ProductHistPurchaseModalComponent implements OnInit {
  private modal = inject(MatDialogRef<ProductHistPurchaseModalComponent>);
  params = inject(MAT_DIALOG_DATA);

  articleName = `${this.params.codigo} -> ${this.params.descripcion}`;

  historyComprasArticle = [];

  documentos: any[] = [];
  columns: DataGridColumn[] = [
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Nro.', field: 'index', sortable: false },
    { header: 'Código Proveedor', field: 'codigoProveedor', sortable: true },
    { header: 'Ruc', field: 'ruc', sortable: true },
    { header: 'Proveedor', field: 'proveedor', sortable: true },
  ];
  isLoadingResults = false;

  isRefresh = false;

  ngOnInit() {
    this.documentos = [
      {
        index: 1,
        codigoProveedor: '001-001-000000009',
      },
    ];
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
      // mS.getData('delete', `${URL}Delete?json=${JSON.stringify({ idDocumento, id: idCompraHabitual })}`).then(response => {
      //   if (response.code == '0') {
      //     tS.toastr('warning', response.message)
      //     return
      //   }
      //   if (response.code == '1') {
      //     let index = $scope.historyComprasArticle.indexOf(item)
      //     $scope.historyComprasArticle.splice(index, 1)
      //     tS.toastr('success', response.message)
      //     isRefresh = true;
      //     $uibModalInstance.close({ isRefresh });
      //   }
      // }).finally(() => hideLoader())
    } catch (error) {
      console.log(error);
    }
  }

  onModalClose() {
    this.modal.close();
  }
}
