import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';

//components
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { Button } from '@acontplus/ng-components';
import { InventoryAdjustmentSearchAdvancedComponent } from '@inventory/ui/inventory-adjustment/inventory-adjustment-search-advanced/inventory-adjustment-search-advanced.component';

import { ProductAutocompleteAdvancedComponent } from '@inventory/ui/product/components/product-autocomplete-advanced/product-autocomplete-advanced.component';
import { TabulatorTable } from '@acontplus/ng-components';
import { GroupedEstabBodega, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { InventoryAdjustment } from '@inventory/data/models/inventory-adjustment.entity';
import {
  InventoryDocumentType,
  InventoryTransactionType,
} from '@inventory/inventory.const';

import { InventoryAdjustmentService } from '@inventory/services/inventory-adjustment.service';
import { roundNumber } from '@core/utils/round-number.utils';
import { ValidationException } from '@core/domain';
import { setDateWithCurrentTime } from '@core/utils/date.util';
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import DecimalUtil from '@core/utils/decimal.util';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-inventory-adjustment-add-edit',
  imports: [
    MatCustomDialogComponent,
    Button,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    ProductAutocompleteAdvancedComponent,
    TabulatorTable,
    MatTooltip,
  ],
  templateUrl: './inventory-adjustment-add-edit.component.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryAdjustmentAddEditComponent implements OnInit {
  private $productService = inject(PRODUCT_SERVICE);
  private inventoryAdjustmentSvc = inject(InventoryAdjustmentService);
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentAddEditComponent>);
  private params = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  tiposDoc = computed(
    () => this.inventoryAdjustmentSvc.inventoryAdjustmentStore.mainFormData().tiposDoc,
  );
  tiposTransaccion = computed(
    () => this.inventoryAdjustmentSvc.inventoryAdjustmentStore.mainFormData().tiposTransaccion,
  );
  estabs = computed(
    () => this.inventoryAdjustmentSvc.inventoryAdjustmentStore.mainFormData().estabs,
  );

  emissionsPoint = signal<GroupedEstabPuntoEmision[]>([]);
  warehouses = signal<GroupedEstabBodega[]>([]);

  title = signal('Nueva Consolidación');
  btnText = signal('Guardar');
  icon = signal('save');

  dataSourceItems = signal<any[]>([]);
  dataSourceItemsDeleted = signal<any[]>([]);

  adjustmentForm!: FormGroup;
  isEditMode = false;
  adjustmentId?: number;

  cloneEstablishmentId = signal(0);
  cloneWarehouseId = signal(0);

  currentAdjustment = InventoryAdjustment.create({
    emissionPointId: 1,
    documentTypeId: 0,
    transactionTypeId: 0,
    emissionDate: new Date(),
    observations: '',
  });

  decimal = signal(this.inventoryAdjustmentSvc.inventoryAdjustmentStore.mainFormData().decimal);

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    const column: any = cell.getColumn().getField();
    const data: any = cell.getData();
    // const oldValue = cell.getOldValue();
    // const value = cell.getValue();

    const editor: any = document.createElement('select');

    if (column === 'unitOfMeasureId') {
      for (const m of data.measures) {
        const opt = document.createElement('option');
        opt.value = m.idMedida.toString();
        opt.innerHTML = m.descripcion;
        console.log(m);
        editor.appendChild(opt);
      }
    }

    if (column === 'warehouseId') {
      for (const b of this.warehouses()) {
        const opt = document.createElement('option');

        opt.value = b.idBodega.toString();
        opt.innerHTML = b.descripcion;
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

  columns = [
    {
      formatter: 'rownum',
      headerSort: false,
      hozAlign: 'center',
    },
    {
      title: 'Op.',
      formatter: (cell: any) => {
        //create delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `x`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-xs', 'btn-sm');
        delBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          this.askToRemove(rowData);
        });

        const buttonHolder = document.createElement('span');
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
      width: '40px',
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
      field: 'unitOfMeasureId',
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
      headerHozAlign: 'center',
      width: '9px',
      editor: this.comboEditor,
      editorParams: () => this.warehouses(),
      formatter: function (cell: any, formatterParams: any) {
        for (const ti of formatterParams) {
          if (ti.idBodega == cell.getValue()) {
            return ti.descripcion;
          }
        }
      },
      formatterParams: () => this.warehouses(),
      validator: 'required',
    },
  ];

  private askToRemove = async (row: any) => {
    const { isConfirmed } = await Swal.fire({
      html: `<small>¿Estas seguro/a de eliminar este Artículo <b>${row.description}</b></small>?`,
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: `Sí`,
      showCancelButton: true,
      cancelButtonText: 'No',
      allowOutsideClick: false,
    });

    if (isConfirmed) {
      const index = this.currentAdjustment.getDetailIndex(row.productId);
      this.currentAdjustment.removeDetail(index);
      if (row.id > 0) {
        this.dataSourceItemsDeleted.update((r) => [...r, { ...row, status: false }]);
      }
      this.updateDataSourceItems();
    }
  };
  updateDataSourceItems() {
    this.dataSourceItems.set(this.currentAdjustment.toPlainObject().details);
  }

  ngOnInit() {
    this.initializeForms();
    this.checkEditMode();

    const dataEstab = this.estabs().find((estabs) => estabs.defaultEstab);

    this.emissionsPoint.set(dataEstab?.puntosEmision || []);
    this.warehouses.set(dataEstab?.bodegas ?? []);
    const emissionPointData = this.emissionsPoint().find((item) => item.defaultPtoEmi);
    const warehouseData = this.warehouses().find((b) => b.defaultBodega);
    const establishmentId = dataEstab?.idEstablecimiento ?? 0;
    const warehouseId = warehouseData?.idBodega ?? 0;
    this.adjustmentForm.patchValue({
      establishmentId: dataEstab?.idEstablecimiento ?? 0,
      emissionPointId: emissionPointData?.idPuntoEmision ?? 0,
      warehouseId,
    });
    this.cloneEstablishmentId.set(establishmentId);
    this.cloneWarehouseId.set(warehouseId);
  }

  private initializeForms() {
    this.adjustmentForm = this.fb.group({
      establishmentId: [0, Validators.required],
      emissionPointId: [0, Validators.required],
      warehouseId: [0, Validators.required],
      documentType: [InventoryDocumentType.CONSOLIDATION],
      transactionType: [
        {
          value: InventoryTransactionType.ADJUSTMENT,
          disabled: true,
        },
      ],
      emissionDate: [new Date(), Validators.required],
      observations: [''],
    });

    this.adjustmentForm.get('documentType')?.valueChanges.subscribe((change) => {
      console.log(change);

      const transactionTypeMap = {
        [InventoryDocumentType.CONSOLIDATION]: InventoryTransactionType.ADJUSTMENT,
        [InventoryDocumentType.INVENTORY_WRITEOFF]: InventoryTransactionType.OUTBOUND,
        [InventoryDocumentType.INVENTORY_RECEIPT]: InventoryTransactionType.INBOUND,
      };

      const transactionType = transactionTypeMap[change as InventoryDocumentType];
      console.log(change);
      console.log(transactionTypeMap);
      if (transactionType) {
        this.adjustmentForm.patchValue({
          transactionType: transactionType,
        });
      }
      if (this.esBajaInventario()) {
        this.setZeroInDetail();
      }
    });
  }

  private esBajaInventario() {
    return (
      this.adjustmentForm.getRawValue().documentType === InventoryDocumentType.INVENTORY_WRITEOFF
    );
  }

  setZeroInDetail() {
    this.currentAdjustment.toPlainObject().details.forEach((detail, index) => {
      this.currentAdjustment.updateQuantityDetail(index, 0);
    });
    this.updateDataSourceItems();
  }

  private checkEditMode(): void {
    const id = 0;
    if (id) {
      this.isEditMode = true;
      this.adjustmentId = +id;
      // this.loadAdjustment(this.adjustmentId);
    } else {
      // Create new adjustment locally
    }
  }

  changeEstablishment() {
    Swal.fire({
      title: '<small>Cambiar Establecimiento?</small>',
      html: '<small>¿Estás seguro de cambiar <b>Punto de Emisión</b> y la <b>Bodega</b>?</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (!result.isConfirmed) {
        this.adjustmentForm.patchValue({
          establishmentId: this.cloneEstablishmentId(),
        });
        return;
      }
      const establishmentId = this.adjustmentForm.value.establishmentId;

      this.cloneEstablishmentId.set(establishmentId);
      const dataEstab = this.estabs().find((item) => item.idEstablecimiento === establishmentId);

      this.emissionsPoint.set(dataEstab?.puntosEmision || []);
      this.warehouses.set(dataEstab?.bodegas ?? []);
      const emissionPointData = this.emissionsPoint().find((item) => item.defaultPtoEmi);
      const warehouseData = this.warehouses().find((b) => b.defaultBodega);
      const warehouseId = warehouseData?.idBodega ?? 0;
      this.adjustmentForm.patchValue({
        establishmentId: dataEstab?.idEstablecimiento ?? 0,
        emissionPointId: emissionPointData?.idPuntoEmision ?? 0,
        warehouseId,
      });

      this.currentAdjustment.updateAllWarehouseToDetail(warehouseId);
      this.updateDataSourceItems();
    });
  }

  askToChangeBodega = async () => {
    const { isConfirmed } = await Swal.fire({
      html: `<small>Esta seguro de cambiar la bodega en todo el Documento?</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: `Sí, cambiar!`,
      cancelButtonText: 'No, cancelar!',
      allowOutsideClick: false,
      reverseButtons: false,
    });

    if (isConfirmed) {
      this.cloneWarehouseId.set(this.adjustmentForm.getRawValue().warehouseId);
      this.setZeroInDetail();
    } else {
      this.adjustmentForm.patchValue({
        warehouseId: this.cloneWarehouseId(),
      });
    }
  };

  askToChangeQuantityZero() {
    Swal.fire({
      text: '¿Estás seguro de cambiar la cantidad de los artículos en 0',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.setZeroInDetail();
      }
    });
  }

  openSearchAdvanced(): void {
    const dialogRef = this.inventoryAdjustmentSvc.dialogSvc.open(
      InventoryAdjustmentSearchAdvancedComponent,
      {
        size: 'xl',
        data: {
          warehouseId: this.adjustmentForm.getRawValue().warehouseId,
        },
      },
    );

    dialogRef.subscribe((result) => {
      if (!this.isValidResult(result)) {
        return;
      }

      const { selectedRows, opcion, isExcelImport } = result;
      this.addSelectedItemsToDataSource(selectedRows, opcion, isExcelImport);
    });
  }

  private isValidResult(
    result: any,
  ): result is { selectedRows: any[]; opcion?: number; isExcelImport?: boolean } {
    return result && Array.isArray(result.selectedRows) && result.selectedRows.length > 0;
  }

  private addSelectedItemsToDataSource(
    selectedRows: any[],
    opcion?: number,
    isExcelImport?: boolean,
  ): void {
    const existItem = (productId: number) => {
      return !this.currentAdjustment
        .toPlainObject()
        .details.some((existingItem) => existingItem.productId === productId);
    };
    selectedRows
      .filter((item) => existItem(item.idArticulo))
      .forEach((item) => {
        this.createItemForDataSource(item, opcion, isExcelImport);
      });
    this.updateDataSourceItems();
  }

  private createItemForDataSource(item: any, opcion?: number, isExcelImport?: boolean) {
    const clonedItem = structuredClone(item);
    if (!isExcelImport) {
      //   opcion 6 productos importados
      clonedItem.cantidad = opcion === 6 ? clonedItem.cantidad : 1;
    }
    this.currentAdjustment.addDetail({
      productId: +item.idArticulo,
      code: item.codigo,
      warehouseId: +this.adjustmentForm.getRawValue().warehouseId,
      unitOfMeasureId: +item.idMedida,
      measures: item.medidas,
      quantity: +clonedItem.cantidad,
      unitConversion: +clonedItem.conversion,
      transactionQuantity: 0,
      unitPrice: +item.precioUnitario,
      costPrice: +item.precioCosto,
      fractionalCostPrice: +item.precioCostoFraccionado,
      description: item.descripcion,
      notes: item.notes,
      status: true,
    });
  }

  itemSelected($event: any) {
    this.inventoryAdjustmentSvc.getProductById($event.id).subscribe((result) => {
      const { data, measures } = result;
      if (!data.hasInventory) {
        Swal.fire({
          icon: 'warning',
          html: 'Este articulo no esta configurado para llevar inventario',
        });
        return;
      }

      const existingDetailIndex = this.currentAdjustment.getDetailIndex(data.id);
      if (existingDetailIndex !== -1) {
        Swal.fire({
          text: '¿Desea sumar la cantidad del producto en el detalle?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si!',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result) {
            this.currentAdjustment.updateDetail(existingDetailIndex);
          }
        });
        return;
      }

      const measureData = measures.find((m) => m.defaultMedida);
      if (!measureData) {
        return;
      }

      const unitPrice = measureData.precioUnitario;
      const costPrice = measureData.precioCosto;
      const unitConversion = +measureData.conversion;
      const fractionalCostPrice = +measureData.precioCostoFraccionado;

      this.currentAdjustment.addDetail({
        productId: +data.id,
        code: data.code,
        warehouseId: +this.adjustmentForm.getRawValue().warehouseId,
        unitOfMeasureId: measureData.idMedida,
        measures,
        quantity: 1,
        unitConversion,
        transactionQuantity: 0,
        unitPrice,
        costPrice: roundNumber(costPrice, this.decimal().nroPrecio),
        fractionalCostPrice,
        description: data.description,
        status: true,
      });
      this.updateDataSourceItems();
    });
  }

  cellEdited(cell: any) {
    const column = cell.getColumn().getField();
    const oldValue = parseFloat(cell.getOldValue());
    const value = parseFloat(cell.getValue());
    const data = cell.getData();

    const existingDetailIndex = this.currentAdjustment.getDetailIndex(data.productId);

    if (value === oldValue) {
      cell.setValue(oldValue);
      return;
    }
    if (isNaN(value) || cell.getValue() === '') {
      cell.setValue(oldValue);
      return;
    }

    if (value < 0) {
      data[column] = oldValue;
    }

    if (column === 'quantity') {
      if (this.esBajaInventario() && value > oldValue) {
        this.$productService
          .checkNotificationStock({
            cantidad: DecimalUtil.multiplyAsNumber(data.quantity, data.unitConversion),
            idArticulo: data.productId,
            idBodega: data.warehouseId,
            idMedida: data.unitOfMeasureId,
          })
          .subscribe(async (response) => {
            const { code, message, titleSms } = response;

            if (code === '1') {
              this.currentAdjustment.updateQuantityDetail(existingDetailIndex, value);
              this.updateDataSourceItems();
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
              if (code === '0') {
                this.currentAdjustment.updateQuantityDetail(existingDetailIndex, oldValue);
              }
              if (code === '2') {
                this.currentAdjustment.updateQuantityDetail(existingDetailIndex, value);
              }
              this.updateDataSourceItems();
            }
          });
      } else {
        this.currentAdjustment.updateQuantityDetail(existingDetailIndex, value);
      }
    }

    if (column === 'unitOfMeasureId') {
      this.currentAdjustment.updateMeasure(existingDetailIndex, value);
    }

    if (column === 'unitPrice') {
      this.currentAdjustment.updatePricing(existingDetailIndex, value);
    }

    if (column === 'warehouseId' && value !== oldValue) {
      Swal.fire({
        icon: 'warning',
        html: `¿Estas seguro de cambiar la bodega?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        let warehouseId = value;
        if (!result.isConfirmed) {
          warehouseId = oldValue;
        }
        this.currentAdjustment.updateWarehouseId(existingDetailIndex, warehouseId);
        this.updateDataSourceItems();
      });
    }
    this.updateDataSourceItems();
  }

  canSave(): boolean {
    return this.adjustmentForm.valid && (this.currentAdjustment?.hasDetails() || false);
  }

  onSubmit() {
    try {
      if (
        !(
          this.adjustmentForm.valid &&
          this.currentAdjustment &&
          this.currentAdjustment.hasDetails()
        )
      ) {
        Swal.fire({
          icon: 'warning',
          text: 'Ingrese todo los campos requeridos',
        });
        return;
      }
      const formValue = this.adjustmentForm.getRawValue();

      const dataTipoDoc = this.tiposDoc().find((t) => t.codigo === formValue.documentType);
      const dataTipoTransaccion = this.tiposTransaccion().find(
        (t) => t.codigo === formValue.transactionType,
      );
      const dataEstab = this.estabs().find(
        (t) => t.idEstablecimiento === formValue.establishmentId,
      );

      const documentTypeId = dataTipoDoc?.idTipoDocumento;
      const transactionTypeId = dataTipoTransaccion?.idTipoTransaccion;
      const codEstab = dataEstab?.codEstab;

      if (!documentTypeId) {
        throw new ValidationException(
          'documentTypeId',
          documentTypeId,
          `Invalid documentTypeId: ${documentTypeId}.`,
        );
      }

      if (!transactionTypeId) {
        throw new ValidationException(
          'transactionTypeId',
          transactionTypeId,
          `Invalid transactionTypeId: ${transactionTypeId}.`,
        );
      }

      if (!codEstab) {
        throw new ValidationException('codEstab', codEstab, `Invalid codEstab: ${codEstab}.`);
      }

      const details = [...this.dataSourceItems(), ...this.dataSourceItemsDeleted()];

      const hasInvalidQuantities = details.some(
        (detail) => detail.quantity <= 0 || detail.transactionQuantity <= 0,
      );
      if (hasInvalidQuantities) {
        Swal.fire({
          icon: 'error',
          text: 'Cantidad o Cantidad Transacción no válido',
        });
        return;
      }

      const hasInvalidPrices = details.some(
        (detail) => detail.unitPrice < 0 || detail.costPrice < 0,
      );

      if (hasInvalidPrices) {
        Swal.fire({
          icon: 'error',
          text: 'Precio Unitario no válido',
        });
        return;
      }

      const saveCommand = {
        emissionPointId: formValue.emissionPointId,
        documentTypeId,
        transactionTypeId,
        codEstab,
        emissionDate: setDateWithCurrentTime(formValue.emissionDate),
        observations: formValue.observations,
        total: this.currentAdjustment.total.value,
        details,
      };
      console.log(saveCommand);

      // if(!this.isEditMode){
      //   this.inventoryAdjustmentSvc.createUseCase.execute(saveCommand)
      // }
    } catch (error) {
      console.log(error);
    }
  }
  close() {
    this.dialogRef.close();
  }
}
