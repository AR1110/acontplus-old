import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {TablaResumenTotalesComponent} from "@shared/components/tabla-resumen-totales/tabla-resumen-totales.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotaEntregaService} from "@sale/data/services/nota-entrega.service";
import {finalize} from "rxjs";
import {ProformaInvoiceViewDetailUseCase} from "@sale/domain/use-cases/proforma-invoice.use-case";
import {DataGrid} from "@shared/components/data-grid/data-grid";
import {DataGridColumn} from "@shared/components/data-grid/types";

@Component({
  selector: 'app-proforma-invoice-detail',
  imports: [
    MatCustomDialogComponent,
    TablaResumenTotalesComponent,
    DataGrid
  ],
  templateUrl: './proforma-invoice-detail.html',
  styleUrl: './proforma-invoice-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProformaInvoiceDetail {
  readonly dialogRef = inject(MatDialogRef<ProformaInvoiceDetail>);
  readonly data = inject<{ id: number }>(MAT_DIALOG_DATA);
  private notaEntregaSvc = inject(NotaEntregaService);
  private _viewDetailUseCase = inject(ProformaInvoiceViewDetailUseCase);

  isLoading = signal(false);

  headerData = {} as any;
  clienteData = {} as any;
  details = signal<any[]>([]);
  additionalsInfo = signal<any[]>([]);
  taxes = signal<any[]>([]);

  columns: DataGridColumn[] = [
    { header: 'Nro.', field: 'index' },
    { header: 'Producto', field: 'product' },
    {
      header: 'Cantidad/Unidad ',
      field: 'quantityData',
    },
    { header: ' Precios y Descuentos ', field: 'pricing' },
    {header: 'Subtotal sin Impuestos', field: 'totalWithoutTax'},
    { header: 'Impuesto', field: 'taxes' },
    { header: 'Total', field: 'total' },
    { header: 'Bodega', field: 'warehouse' }
  ];

  columnsAdditionalsInfo: DataGridColumn[] = [
    {header: 'Nombre', field: 'name'},
    {header: 'Valor', field: 'value'},
  ]

  ngOnInit() {
    this.isLoading.set(true);
    this._viewDetailUseCase
      .execute(this.data.id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe(response => {
        console.log(response)
        const { header, customer, details, additionalsInfo, taxes } = response;

        this.headerData = header;
        this.clienteData = customer;
        this.details.set(details)
        this.additionalsInfo.set(additionalsInfo);
        this.taxes.set(taxes);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
