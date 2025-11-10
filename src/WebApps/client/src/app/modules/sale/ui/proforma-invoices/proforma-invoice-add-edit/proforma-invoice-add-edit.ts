import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CompanyCustomerSearchComponent } from '@company-customer/presentation/components/company-customer-search/company-customer-search.component';
import { AddEditProductDirective } from '@inventory/product/presentation/directives/add-edit-product.directive';
import { MatIconButton } from '@angular/material/button';
import { ProductSearchDialog } from '@inventory/product/presentation/components/product-search-dialog/product-search-dialog';
import { SearchDialogService } from '@shared/services/search-dialog';
import { MatIcon } from '@angular/material/icon';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { TotalizadorUtil } from '@core/utils/totalizador.util';
import {
  GetProductSaleUseCase,
  ValidateProductStockUseCase,
} from '@inventory/product/application/use-cases/product/get-product.use-case';
import { ProductSale } from '@inventory/product/domain/entities/product.entity';
import { MedidaProducto } from '@inventory/domain/models/measure.model';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { roundNumber } from '@core/utils/round-number.utils';
import Swal from 'sweetalert2';
import { getStockQuantity, mergeStockItems } from '@inventory/product/domain/utils/stock.utils';
import { firstValueFrom } from 'rxjs';
import { ProductFee } from '@inventory/domain/models/tarifa.model';

@Component({
  selector: 'app-proforma-invoice-add-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatCustomDialogComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    CompanyCustomerSearchComponent,
    AddEditProductDirective,
    MatIcon,
    MatIconButton,
    TabulatorComponent,
    DataGrid,
  ],
  templateUrl: './proforma-invoice-add-edit.html',
  styleUrl: './proforma-invoice-add-edit.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProformaInvoiceAddEdit implements OnInit {
  private dgRef = inject(MatDialogRef<ProformaInvoiceAddEdit>);

  //services
  private searchService = inject(SearchDialogService);

  //use cases
  private _productSaleUseCase = inject(GetProductSaleUseCase);
  private $validateProductStockUseCase = inject(ValidateProductStockUseCase);

  //variables form
  vatRates = signal<any[]>([]);

  dataFormGeneral = {
    warehouseId: 0,
    rateId: 0,
  };

  dataForm = {
    issueDate: new Date(),
  };

  isDuplicateItem = signal(false);
  isLoadingProduct = signal(false);
  uuidRow = signal('');

  details = signal<any[]>([]);
  detailsDeleted = signal<any[]>([]);

  priceDecimals = signal(2);

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    const column: any = cell.getColumn().getField();
    const data: any = cell.getData();
    // const oldValue = cell.getOldValue();
    // const value = cell.getValue();

    const editor: any = document.createElement('select');

    if (column === 'measureId') {
      for (const m of data.measures) {
        const opt = document.createElement('option');
        opt.value = m.idMedida.toString();
        opt.innerHTML = m.descripcion;
        editor.appendChild(opt);
      }
    }

    editor.style.padding = '3px';
    editor.style.width = '100%';
    editor.style.boxSizing = 'border-box';

    editor.value = Number(cell.getValue());

    onRendered(function () {
      editor.focus();
      editor.style.css = '100%';
    });

    function successFunc() {
      success(editor.value);
    }

    editor.addEventListener('change', successFunc);
    editor.addEventListener('blur', successFunc);

    return editor;
  };

  columns = signal([
    {
      formatter: 'rownum',
      headerSort: false,
      hozAlign: 'center',
    },
    {
      title: 'Op.',
      formatter: (cell: any) => {
        const rowData = cell.getRow().getData();

        // contenedor de botones
        const buttonHolder = document.createElement('div');
        buttonHolder.style.display = 'flex';
        buttonHolder.style.gap = '4px'; // espacio entre botones
        buttonHolder.style.justifyContent = 'center';
        buttonHolder.style.alignItems = 'center';

        // Botón Eliminar
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 6h18" stroke="currentColor" stroke-width="2"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" stroke-width="2"/>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
        delBtn.classList.add('small-button', 'btn-remove');
        delBtn.addEventListener('click', () => {
          // this.deleteRow(rowData);
        });

        // Botón Editar
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" fill="currentColor"/>
      </svg>
    `;
        editBtn.classList.add('small-button', 'btn-edit');
        editBtn.addEventListener('click', () => {
          console.log('Editar:', rowData);
        });

        // Agregar botones al contenedor
        buttonHolder.appendChild(editBtn);
        buttonHolder.appendChild(delBtn);

        return buttonHolder;
      },
      width: 100,
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
    },
    {
      title: 'Código',
      field: 'code',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '8px',
    },
    {
      title: 'Producto',
      field: 'description',
      editor: false,
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '20px',
    },
    {
      title: 'Cant.',
      field: 'quantity',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      width: '7px',

      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
    },
    {
      title: 'Medida',
      field: 'measureId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const m of data.measures) {
          if (m.idMedida == cell.getValue()) {
            return m.descripcion;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },

    {
      title: 'Tipo Iva',
      field: 'taxId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const m of data.measures) {
          if (m.idMedida == cell.getValue()) {
            return m.descripcion;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },

    {
      title: 'Precio U.',
      field: 'unitPrice',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      formatterParams: { precision: false },
    },
    {
      title: 'Precio con Iva',
      field: 'priceWithTax',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      formatterParams: { precision: false },
    },
    {
      title: '%',
      field: 'discountPercentage',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      formatterParams: { precision: false },
    },
    {
      title: 'Des.',
      field: 'discount',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      formatterParams: { precision: false },
    },
    {
      title: 'SubTotal',
      field: 'priceWithoutPrice',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      formatterParams: { precision: false },
    },
    {
      title: 'SubTotal',
      field: 'taxValue',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '9px',
      validator: ['required'],
      editor: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      formatterParams: { precision: false },
    },
    {
      title: 'Total',
      field: 'total',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
    },
    {
      title: 'Bodega',
      field: 'warehouseId',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '6px',
    },
  ]);

  displayedTotalsColumns: DataGridColumn[] = [
    { header: '', field: 'label' },
    { header: '', field: 'value' },
  ];
  totalRows: any[] = [];

  additionalInfo = signal<any>([{}, {}]);
  columnsAdditionalInfo: DataGridColumn[] = [
    { header: 'Op.', field: 'op' },
    { header: 'Nombre', field: 'name' },
    { header: 'Valor', field: 'value' },
  ];

  ngOnInit() {
    const items: any[] = [
      {
        cantidad: 2,
        precioUnitario: 100,
        precioTotalSinImpuesto: 200,
        valorDescuento: 0,
        codigoPorcentaje: '2',
        ice: 0,
      },
      {
        cantidad: 1,
        precioUnitario: 50,
        precioTotalSinImpuesto: 50,
        valorDescuento: 5,
        codigoPorcentaje: '0',
        ice: 0,
      },
    ];

    const tarifasImpuesto: any[] = [
      { codigoPorcentaje: '0', descripcion: 'IVA 0%', tarifa: 0 },
      { codigoPorcentaje: '2', descripcion: 'IVA 12%', tarifa: 12 },
    ];

    const totalizador = new TotalizadorUtil();

    const resultado = totalizador.calcular({
      items,
      tarifasImpuesto,
    });

    this.totalRows = resultado.totalRows;

    this.searchService.onResult().subscribe((result) => {
      this.handleSearchResult(result);
    });
  }

  openSearch(): void {
    this.searchService.open(ProductSearchDialog)?.subscribe((result) => {
      this.handleSearchResult(result);
    });
  }

  private addRow() {
    return {
      uuid: generateUuidv4(),
      id: 0,
      code: '',
      productId: 0,
      description: '',
      quantity: 0,
      stockQuantity: 0,
      taxCode: '',

      productFees: [] as ProductFee[],
      measureId: 0,
      measures: [] as MedidaProducto[],
      conversion: 1,
      feeId: 0,
      unitPrice: 0,
      unitCost: 0,
      fractionalUnitCost: 0,
      priceWithoutSubsidy: 0,
      priceWithTax: 0,
      discountPercentage: 0,
      discountValue: 0,
      totalDiscount: 0,
      iceTax: 0,
      warehouseId: 0,
      subTotal: 0,
      total: 0,
      minWholesaleQuantity: 0,
      note: null,
      hasInventory: false,
      hasAdditionalData: false,
      additionalProductInfo: [],
      inventoryAdjustments: [],
      status: 1,
    };
  }

  private handleSearchResult(result: any): void {
    if (!result || typeof result !== 'object' || this.isLoadingProduct()) return;

    this.isLoadingProduct.set(true);

    this._productSaleUseCase.execute({ id: result.id }).subscribe({
      next: async (response) => {
        try {
          const { product, medidas, inventoryAdjustments, additionalInfo } = response;
          const measures = medidas as MedidaProducto[];

          if (!measures?.length) throw new Error('No se encontraron medidas del producto');

          //  Medida por defecto
          const defaultMeasure = measures.find((m) => m.defaultMedida);
          if (!defaultMeasure) throw new Error('No se encontró la medida por defecto');

          //  Tarifa (fee)
          const rateId = this.dataFormGeneral.rateId;
          const fee = defaultMeasure.fees.find((f) => f.id === rateId);
          if (!fee) throw new Error('No se encontró la tarifa por defecto');

          let rowData: any;
          let shouldAddRow = false;

          //  Si el producto lleva inventario → revisar duplicados
          if (product.llevaInventario) {
            const existingItems = this.details().filter((d) => d.productId === product.idArticulo);
            const existingIndex = existingItems.findIndex(
              (d) => d.productId === product.idArticulo,
            );

            if (this.isDuplicateItem()) {
              rowData = this.addRow();
              rowData.quantity = 1;
              shouldAddRow = true;
            } else {
              if (existingItems.length > 1) {
                Swal.fire({
                  icon: 'warning',
                  html: `<small>El elemento <b>${product.descripcion}</b> aparece más de una vez en el detalle.</small>`,
                });
                return;
              }

              if (existingIndex === -1) {
                // No existe → agregar nuevo
                rowData = this.addRow();
                rowData.quantity = 1;
                shouldAddRow = true;
              } else {
                // Ya existe → incrementar cantidad
                rowData = existingItems[existingIndex];
                rowData.quantity += 1;
              }
            }
          }
          //  Si NO lleva inventario → siempre agregar
          else {
            rowData = this.addRow();
            rowData.quantity = 1;
            shouldAddRow = true;
          }

          // 🧾 Asignar datos del producto
          Object.assign(rowData, {
            productId: product.idArticulo,
            code: product.codigoArticulo,
            description: product.descripcion,
            taxCode: product.codigoPorcentaje,
            iceTax: product.valorIce,
            warehouseId: this.dataFormGeneral.warehouseId,
            hasInventory: product.llevaInventario,
            hasAdditionalData: product.datosAdicionales,
            measures,
            measureId: defaultMeasure.idMedida,
            conversion: defaultMeasure.conversion,
            unitCost: defaultMeasure.precioCosto,
            fractionalUnitCost: defaultMeasure.precioCostoFraccionado,
            additionalProductInfo: (additionalInfo ?? []).map((info: any) => ({
              ...info,
              uniqueDetailRow: rowData.uuid,
            })),
            inventoryAdjustments,
            productFees: defaultMeasure.fees,
            feeId: rateId,
            priceWithoutSubsidy: product.precioSinSubsidio ?? 0,
            unitPrice: roundNumber(fee.salePrice, this.priceDecimals()),
            priceWithTax: roundNumber(fee.priceWithTax, this.priceDecimals()),
            minWholesaleQuantity: product.cantMinimaVentaPorMayor ?? 0,
          });

          // ⚖ Validar stock solo si lleva inventario
          if (rowData.hasInventory) {
            const updatedDetails = this.updateDetailInList(rowData.uuid, rowData);
            const isValid = await this.validateStockAsync(updatedDetails, rowData.uuid);
            if (!isValid) return;
          }

          //  Agregar o actualizar en details
          if (shouldAddRow) {
            this.details.update((list) => [...list, rowData]); // push
          } else {
            this.details.update((list) =>
              list.map((item) => (item.uuid === rowData.uuid ? rowData : item)),
            ); // update
          }
        } catch (error: any) {
          console.error('Error al procesar el producto:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            html: `<small>${error.message ?? 'Error al procesar el producto'}</small>`,
          });
        } finally {
          this.isLoadingProduct.set(false);
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoadingProduct.set(false);
      },
    });
  }

  private updateDetailInList(uuid: string, newData: any): any[] {
    return this.details().map((item) => (item.uuid === uuid ? { ...newData } : item));
  }
  private validateStockAsync(details: any[], rowUUID: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.validateStock(details, rowUUID, (cont: boolean) => resolve(cont));
    });
  }

  private async validateStock(
    details: any[],
    rowUUID: string,
    fn: (cont: boolean) => void,
  ): Promise<void> {
    try {
      const { warehouseId, productId, measureId, stockQuantity, inventoryAdjustment } =
        mergeStockItems(details, {
          rowUUID,
        });

      const quantity = getStockQuantity({
        issueDate: this.dataForm.issueDate,
        stockQuantity,
        adjustment: inventoryAdjustment,
      });

      const response = await firstValueFrom(
        this.$validateProductStockUseCase.execute({
          cantidad: quantity,
          idArticulo: productId,
          idBodega: warehouseId,
          idMedida: measureId,
        }),
      );
      const { code, message, titleSms } = response;

      //  Caso aprobado directamente
      if (code === '1') {
        fn(true);
        return;
      }

      const { isConfirmed } = await Swal.fire({
        title: `<small>${titleSms}</small>`,
        icon: 'warning',
        html: `<small>${message}</small>`,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (isConfirmed) {
        // code === '0' → rechazar
        // code === '2' → aceptar bajo advertencia
        fn(code === '2');
      }
    } catch (error) {
      console.error('Error validating stock:', error);
      fn(false);
    }
  }

  async cellEdited(cell: any): Promise<void> {}

  closeDg() {
    this.dgRef.close();
  }
}
