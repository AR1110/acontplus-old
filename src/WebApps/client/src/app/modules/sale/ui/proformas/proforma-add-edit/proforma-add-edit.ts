import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { AddEditProductDirective } from '@inventory/ui/product/components/directives/add-edit-product.directive';
import { MatIconButton } from '@angular/material/button';
import { ProductSearchDialog } from '@inventory/ui/product/components/product-search-dialog/product-search-dialog';
import { SearchDialogService } from '@shared/services/search-dialog';
import { MatIcon } from '@angular/material/icon';
import { TabulatorTable } from '@acontplus/ng-components';
import { DataGrid } from '@shared/components/data-grid/data-grid';
import { DataGridColumn } from '@shared/components/data-grid/types';
import { TotalizadorUtil } from '@core/utils/totalizador.util';
import { PRODUCT_SERVICE } from '@inventory/tokens/inventory-token';
import { MedidaProducto } from '@inventory/domain/models/measure.model';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { roundNumber } from '@core/utils/round-number.utils';
import Swal from 'sweetalert2';
import { getStockQuantity, mergeStockItems } from '@inventory/domain/utils/stock.utils';
import { firstValueFrom } from 'rxjs';
import { ProductFee } from '@inventory/domain/models/tarifa.model';
import { ProformaInvoiceGetFormDataUseCase } from '@sale/application/use-cases/proforma-use-case';
import { GroupedEstablishment } from '@core/models/establishment';
import { EmissionPointEstablishment } from '@core/models/emission-point';
import { WarehouseEstablishment } from '@core/models/warehouse';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { Fee } from '@inventory/domain/models/fee';
import { TaxRate } from '@core/models/tax-rate';
import { ProductMeasure } from '@inventory/domain/models/product-measure';
import { ProformaDetail } from '@sale/domain/models/proforma-detail';

@Component({
  selector: 'app-proforma-add-edit',
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
    TabulatorTable,
    DataGrid,
  ],
  templateUrl: './proforma-add-edit.html',
  styleUrl: './proforma-add-edit.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProformaAddEdit implements OnInit {
  private dgRef = inject(MatDialogRef<ProformaAddEdit>);
  private params = inject<{ id: number; operation: 'add' | 'edit' | 'duplicate' }>(MAT_DIALOG_DATA);

  //services
  private searchService = inject(SearchDialogService);
  private notiSvc = inject(ToastrNotificationService);

  //use cases
  private _productService = inject(PRODUCT_SERVICE);
  private $getFormData = inject(ProformaInvoiceGetFormDataUseCase);

  //variables form
  vatRates = signal<any[]>([]);

  dataFormGeneral = {
    warehouseId: 0,
    feeId: 0,
  };

  dataForm = {
    issueDate: new Date(),
    establishmentId: 0,
    emissionPointId: 0,
  };

  isDuplicateItem = signal(false);
  isLoadingProduct = signal(false);
  uuidRow = signal('');

  details = signal<any[]>([]);
  detailsDeleted = signal<any[]>([]);

  priceDecimals = signal(2);

  estabs = signal<GroupedEstablishment[]>([]);
  emissionPoints = signal<EmissionPointEstablishment[]>([]);
  warehouses = signal<WarehouseEstablishment[]>([]);
  fees = signal<Fee[]>([]);
  taxRates = signal<TaxRate[]>([]);

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    const column: any = cell.getColumn().getField();
    const data: any = cell.getData();
    // const oldValue = cell.getOldValue();
    // const value = cell.getValue();

    const editor: any = document.createElement('select');
    const options = {
      measureId: data.measures,
      taxRateId: this.taxRates(),
      feeId: data.fees,
      warehouseId: this.warehouses(),
    };

    if (['measureId', 'taxRateId', 'feeId', 'warehouseId'].includes(column)) {
      for (const m of options[column as keyof typeof options]) {
        const opt = document.createElement('option');
        opt.value = m.id.toString();
        opt.innerHTML = m.name;
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
          if (m.id == cell.getValue()) {
            return m.name;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },

    {
      title: 'Tipo Iva',
      field: 'taxRateId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: (cell: any) => {
        for (const m of this.taxRates()) {
          if (m.id == cell.getValue()) {
            return m.name;
          }
        }
        return '';
      },
      validator: 'required',
      width: '9px',
    },
    {
      title: 'Tarifa',
      field: 'feeId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: (cell: any) => {
        console.log(cell.getData());
        for (const m of cell.getData().fees ?? []) {
          if (m.id == cell.getValue()) {
            return m.name;
          }
        }
        return '';
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
      width: '7px',
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
      field: 'discountPercent',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '7px',
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
      width: '7px',
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
      field: 'totalPriceWithoutTax',
      headerSort: false,
      headerHozAlign: 'center',
      width: '7px',
      editor: false,
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      formatterParams: { precision: false },
      formatter: (cell: any) => {
        const value = cell.getValue(); // valor interno: ej. 12.34567
        return Number(value).toFixed(2); // solo vista: 12.35
      },
      hozAlign: 'right',
      tooltip: true,
    },
    {
      title: 'V. Imp.',
      field: 'taxValue',
      headerSort: false,
      hozAlign: 'center',
      headerHozAlign: 'center',
      width: '7px',
      editor: false,
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
      editor: false,
    },
    {
      title: 'Bodega',
      field: 'warehouseId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: (cell: any) => {
        for (const m of this.warehouses()) {
          if (m.id == cell.getValue()) {
            return m.name;
          }
        }
        return '';
      },
      validator: 'required',
      width: '9px',
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

  loadFormData() {
    this.$getFormData.execute().subscribe((data) => {
      const { estabs } = data;
      this.estabs.set(estabs);
      this.fees.set(data.fees);
      this.taxRates.set(data.taxRates);

      const dataEstab = this.estabs().find((e) => e.isDefault);
      const defaultFee = this.fees().find((e) => e.isDefault);

      if (!dataEstab) {
        this.notiSvc.warning({
          message: 'No se encontró establecimiento por defecto',
        });
        return;
      }

      if (!defaultFee) {
        this.notiSvc.warning({
          message: 'No se encontró tarifa por defecto',
        });
        return;
      }

      this.emissionPoints.set(dataEstab?.emissionPoints ?? []);
      this.warehouses.set(dataEstab?.warehouses ?? []);

      const defaultEmissionPoint = this.emissionPoints().find((e) => e.isDefault);
      const defaultWarehouse = this.warehouses().find((e) => e.isDefault);

      if (!defaultEmissionPoint) {
        this.notiSvc.warning({
          message: 'No se encontró punto de emisión por defecto',
        });
        return;
      }

      if (!defaultWarehouse) {
        this.notiSvc.warning({
          message: 'No se encontró bodega por defecto',
        });
        return;
      }

      this.dataForm.establishmentId = dataEstab?.id ?? 0;
      this.dataForm.emissionPointId = defaultEmissionPoint?.id ?? 0;
      this.dataFormGeneral.warehouseId = defaultWarehouse?.id ?? 0;
      this.dataFormGeneral.feeId = defaultFee?.id ?? 0;

      if (['edit', 'duplicate'].includes(this.params.operation)) {
      }

      console.log(data);
    });
  }

  ngOnInit() {
    console.log(
      new ProformaDetail({
        unitPrice: 12,
        discount: 6,
      }).calculate(),
    );
    this.loadFormData();
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

  private handleSearchResult(result: any): void {
    if (!result || typeof result !== 'object' || this.isLoadingProduct()) return;

    this.isLoadingProduct.set(true);

    this._productService.getForSale({ id: result.id }).subscribe({
      next: async (response) => {
        try {
          const { product, inventoryAdjustments, additionalInfo } = response;
          const measures = response.measures as ProductMeasure[];

          if (!measures?.length) throw new Error('No se encontraron medidas del producto');

          //  Medida por defecto
          const defaultMeasure = measures.find((m) => m.defaultMeasure);
          if (!defaultMeasure) throw new Error('No se encontró la medida por defecto');

          //  Tarifa (fee)
          const feeId = this.dataFormGeneral.feeId;
          const fee = defaultMeasure.fees.find((f) => f.id === feeId || f.isDefault);
          const dataTaxRate = this.taxRates().find((t) => t.code == product.codigoPorcentaje);
          if (!fee) throw new Error('No se encontró la tarifa por defecto');
          if (!dataTaxRate) {
            throw new Error('No se encontró el tipo impuesto');
          }
          let rowData: ProformaDetail;
          let shouldAddRow = false;

          //  Si el producto lleva inventario → revisar duplicados
          if (product.llevaInventario) {
            const existingItems = this.details().filter((d) => d.productId === product.idArticulo);
            const existingIndex = existingItems.findIndex(
              (d) => d.productId === product.idArticulo,
            );

            if (this.isDuplicateItem()) {
              rowData = ProformaDetail.create();
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
                rowData = ProformaDetail.create();
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
            rowData = ProformaDetail.create();
            rowData.quantity = 1;
            shouldAddRow = true;
          }

          // 🧾 Asignar datos del producto
          Object.assign(rowData, {
            productId: product.idArticulo,
            code: product.codigoArticulo,
            description: product.descripcion,
            taxRateId: dataTaxRate.id,
            taxCode: product.codigoPorcentaje,
            iceTax: product.valorIce,
            warehouseId: this.dataFormGeneral.warehouseId,
            hasInventory: product.llevaInventario,
            hasAdditionalData: product.datosAdicionales,
            measures,
            measureId: defaultMeasure.id,
            conversion: defaultMeasure.conversion,
            unitCost: defaultMeasure.costPrice,
            fractionalUnitCost: defaultMeasure.fractionalCostPrice,
            additionalProductInfo: (additionalInfo ?? []).map((info: any) => ({
              ...info,
              uniqueDetailRow: rowData.uuid,
            })),
            inventoryAdjustments,
            fees: defaultMeasure.fees,
            feeId,
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
        this._productService.checkNotificationStock({
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

  async cellEdited(cell: any): Promise<void> {
    const row = cell.getRow();
    const raw = row.getData(); // valores crudos de Tabulator

    // 1. Convertir a modelo
    const detail = new ProformaDetail(raw).calculate();

    console.log(detail);

    this.updateDetailInList(raw.uuid, detail);
  }

  closeDg() {
    this.dgRef.close();
  }
}
