import {Component, computed, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {DialogService} from "@core/services/dialog.service";
import {
  InventoryAdjustmentSearchAdvancedComponent
} from "@inventory/inventory-adjustment/presentation/inventory-adjustment-add-edit/inventory-adjustment-search-advanced/inventory-adjustment-search-advanced.component";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InventoryAdjustmentStore} from "@inventory/inventory-adjustment/application/store/inventory-adjustment.store";
import {
  ProductAutocompleteAdvancedComponent
} from "@inventory/product/presentation/components/product-autocomplete-advanced/product-autocomplete-advanced.component";
import {
  ProductSearchOverlayComponent
} from "@inventory/product/presentation/components/product-search-overlay/product-search-overlay.component";
import {TabulatorComponent} from "@core/components/tabulator/tabulator.component";
import {GroupedEstabBodega, GroupedEstabPuntoEmision} from "@core/models/estab.model";
import {InventoryAdjustment} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment.entity";
import {InventoryDocumentType, InventoryTransactionType} from "@inventory/domain/enums/inventory.enum";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {
  AddDetailToAdjustmentUseCase
} from "@inventory/inventory-adjustment/application/use-cases/add-detail-to-adjustment.use-case";
import {
  InventoryAdjustmentService
} from "@inventory/inventory-adjustment/application/services/inventory-adjustment.service";
import {GetProductPurchaseUseCase} from "@inventory/product/application/use-cases/product/get-product.use-case";
import Swal from 'sweetalert2';
import {roundNumber} from "@core/utils/round-number.utils";
import {Quantity} from "@inventory/inventory-adjustment/domain/value-objects/quantity.vo";
import {ColSupportMaintenanceDetail} from "@mechanical/domain/models/support-maintenance.model";
import {
  InventoryAdjustmentDetail
} from "@inventory/inventory-adjustment/domain/entities/inventory-adjustment-detail.entity";

@Component({
  selector: 'app-inventory-adjustment-add-edit',
  imports: [
    MatCustomDialogComponent,
    ThemeButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    ProductAutocompleteAdvancedComponent,
    ProductSearchOverlayComponent,
    TabulatorComponent,
  ],
  templateUrl: './inventory-adjustment-add-edit.component.html',
  providers: [provideNativeDateAdapter()],
})
export class InventoryAdjustmentAddEditComponent {
  #dialogSvc = inject(DialogService)
  private dialogRef = inject(MatDialogRef<InventoryAdjustmentAddEditComponent>);
  private params = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  $inventoryAdjustmentStore  = inject(InventoryAdjustmentStore);
  private inventorySvc = inject(InventoryAdjustmentService);



  //use-cases
  private addDetailUseCase = inject(AddDetailToAdjustmentUseCase);
  private $GetProductPurchaseUseCase = inject(GetProductPurchaseUseCase)

  tiposDoc = computed(()=>this.$inventoryAdjustmentStore.mainFormData().tiposDoc)
  tiposTransaccion = computed(()=>this.$inventoryAdjustmentStore.mainFormData().tiposTransaccion)
  estabs = computed(()=>this.$inventoryAdjustmentStore.mainFormData().estabs)

  emissionsPoint = signal<GroupedEstabPuntoEmision[]>([]);
  warehouses = signal<GroupedEstabBodega[]>([])

  title = signal('Nueva Consolidación');
  btnText = signal('Guardar');
  icon = signal('save');

  dataSourceItems = signal<any[]>([])


  adjustmentForm!: FormGroup;
  newDetailForm!: FormGroup;
  isEditMode = false;
  adjustmentId?: number;
  showAddDetailForm = false;

  // LOCAL STATE - No API calls for details management
  currentAdjustment = InventoryAdjustment.create({
    emissionPointId: 1, // Default, will be updated from form
    documentType: InventoryDocumentType.CONSOLIDATION,
    transactionType: InventoryTransactionType.ADJUSTMENT,
    emissionDate: new Date(),
    observations: ''
  });

  dataForm = new FormGroup({
    bodegaId: new FormControl(null, [Validators.required]),
  });


  decimal = signal(this.$inventoryAdjustmentStore.mainFormData().decimal);


  comboEditor = (
    cell: any,
    onRendered: any,
    success: any,
    cancel: any,
    editorParams: any
  ) => {
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
        console.log(m)
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
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },

      // editorEmptyValueFunc: (value: any, cl: any) => {
      //   console.log(cl)
      //   if (/\s/.test(value)) {
      //     console.log(value)

      //   }
      // }
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
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
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

  ngOnInit(){
    console.log(this.$inventoryAdjustmentStore.mainFormData())
    this.initializeForms();
    this.checkEditMode()

    const dataEstab = this.estabs().find(estabs => estabs.defaultEstab);
    console.log(dataEstab)
    this.emissionsPoint.set(dataEstab?.puntosEmision || []);
    this.warehouses.set(dataEstab?.bodegas??[])
    const emissionPointData = this.emissionsPoint().find(item=>item.defaultPtoEmi);
    const warehouseData = this.warehouses().find(b=>b.defaultBodega);
    this.adjustmentForm.patchValue({
      establishmentId: dataEstab?.idEstablecimiento ?? 0,
      emissionPointId: emissionPointData?.idPuntoEmision ?? 0,
      warehouseId: warehouseData?.idBodega ?? 0
    })
    console.log(this.adjustmentForm.getRawValue())

  }

  private initializeForms(){
    this.adjustmentForm = this.fb.group({
      establishmentId: [0, Validators.required],
      emissionPointId: [0, Validators.required],
      warehouseId: [0, Validators.required],
      documentType: [InventoryDocumentType.CONSOLIDATION],
      transactionType: [{
        value: InventoryTransactionType.ADJUSTMENT,
        disabled: true
      }],
      emissionDate: [new Date().toISOString().split('T')[0], Validators.required],
      observations: [''],
      details: this.fb.array([])
    });

    this.newDetailForm = this.fb.group({
      articleId: ['', Validators.required],
      warehouseId: ['', Validators.required],
      unitOfMeasureId: [''],
      quantity: ['', [Validators.required, Validators.min(0.01)]],
      transactionQuantity: ['', [Validators.required, Validators.min(0.01)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]],
      costPrice: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      notes: ['']
    });

    this.adjustmentForm.get("documentType")?.valueChanges.subscribe(change => {
      console.log(change);

      const transactionTypeMap = {
        [InventoryDocumentType.CONSOLIDATION]: InventoryTransactionType.ADJUSTMENT,
        [InventoryDocumentType.INVENTORY_WRITEOFF]: InventoryTransactionType.OUTBOUND,
        [InventoryDocumentType.INVENTORY_RECEIPT]: InventoryTransactionType.INBOUND
      };

      const transactionType = transactionTypeMap[change as InventoryDocumentType];

      if (transactionType) {
        this.adjustmentForm.patchValue({
          transactionType: transactionType
        });
      }
    });
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


  get detailsFormArray(): FormArray {
    return this.adjustmentForm.get('details') as FormArray;
  }


  openSearchAdvanced(): void {
    const dialogRef = this.#dialogSvc.open(InventoryAdjustmentSearchAdvancedComponent, {
      size: 'xl',
      data: {
        // Add any necessary data here
      }
    });

    dialogRef.subscribe(result => {
      if (!this.isValidResult(result)) {
        return;
      }

      const { selectedRows, opcion, isExcelImport } = result;
      console.log(selectedRows);
      console.log(this.currentAdjustment);
      this.addSelectedItemsToDataSource(selectedRows, opcion, isExcelImport);
    });
  }

  private isValidResult(result: any): result is { selectedRows: any[], opcion?: number, isExcelImport?: boolean } {
    return result && Array.isArray(result.selectedRows) && result.selectedRows.length > 0;
  }
  //
  private addSelectedItemsToDataSource(selectedRows: any[], opcion?: number, isExcelImport?: boolean): void {
    const existItem = (productId: number)=>!this.dataSourceItems().some(existingItem => existingItem.productId === productId)
     selectedRows
      .filter(item =>existItem(item.idArticulo))
      .map(item => this.createItemForDataSource(item, opcion, isExcelImport));

    const currentItems = this.currentAdjustment.toPlainObject().details.filter(item =>existItem(item.productId))
    console.log(currentItems);
    if (currentItems.length > 0) {
      this.dataSourceItems.set([...this.dataSourceItems(), ...currentItems]);
    }
  }


  private createItemForDataSource(item: any, opcion?: number, isExcelImport?: boolean): any {
    const clonedItem = structuredClone(item);
    // Set quantity based on conditions
    if (!isExcelImport) {
   //   opcion 6 productos importados
      clonedItem.cantidad = (opcion === 6) ? clonedItem.cantidad : 1;
    }
     this.inventorySvc.addDetail({
      adjustment: this.currentAdjustment,
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
      notes: item.notes
    })
  }




  itemSelected($event:any){
    this.$GetProductPurchaseUseCase.execute($event.id).subscribe(result => {
       console.log(result);
       const {data, measures} = result;
       if(!data.hasInventory){
         Swal.fire({
           icon: 'warning',
           html: 'Este articulo no esta configurado para llevar inventario'
         })
         return
       }

       const existingDetailIndex  = this.currentAdjustment.getDetailIndex(data.id);
       console.log(existingDetailIndex);
      if (existingDetailIndex !== -1) {
        Swal.fire({
          text: '¿Desea sumar la cantidad del producto en el detalle?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si!',
          cancelButtonText: 'No'
        }).then(result => {
          if (result) {
            const existingDetail = this.currentAdjustment.updateDetail(existingDetailIndex);
            this.updateDataSourceItems(existingDetailIndex, existingDetail);
          }
        })
        return;
      }

      const measureData = measures.find(m=>m.defaultMedida);
      if (!measureData) {
        return;
      }

      const unitPrice = measureData.precioUnitario;
      const costPrice = measureData.precioCosto;
      const unitConversion =  +measureData.conversion;
      const fractionalCostPrice = +measureData.precioCostoFraccionado;

      this.inventorySvc.addDetail({
        adjustment: this.currentAdjustment,
        productId: +data.id,
        code: data.code,
        warehouseId: +this.adjustmentForm.getRawValue().warehouseId,
        unitOfMeasureId: measureData.idMedida,
        measures,
        quantity: 1,
        unitConversion,
        transactionQuantity: 0,
        unitPrice,
        costPrice:  roundNumber(costPrice, this.decimal().nroPrecio),
        fractionalCostPrice,
        description: data.description,
      });
      console.log(this.currentAdjustment.toPlainObject())

      this.dataSourceItems.set([...this.currentAdjustment.toPlainObject().details])

    })
  }

  updateDataSourceItems(detailIndex:number, existingDetail: InventoryAdjustmentDetail) {
    this.dataSourceItems.update(ds=>{
      const newDs = [...ds]; // Copia el array
      newDs[detailIndex] = existingDetail.toPlainObject();
      return newDs;

    })
  }



  cellEdited(cell: any) {
    const row = cell.getRow();
    const column = cell.getColumn().getField();
    const oldValue = parseFloat(cell.getOldValue());
    const value = parseFloat(cell.getValue());
    const data = cell.getData();

    const existingDetailIndex  = this.currentAdjustment.getDetailIndex(data.productId);

    if (isNaN(value) || cell.getValue() === '') {
      cell.setValue(oldValue);
      return;
    }

    if (value < 0) {
      data[column] = oldValue;
    }

    if(column==="quantity"){
    const existingDetail = this.currentAdjustment.updateQuantityDetail(existingDetailIndex, value);
    this.updateDataSourceItems(existingDetailIndex, existingDetail);
    }

    if(column==="unitOfMeasureId"){
      const existingDetail = this.currentAdjustment.updateMeasure(existingDetailIndex, value);
      console.log(existingDetail)
      this.updateDataSourceItems(existingDetailIndex, existingDetail);
    }

    if(column==="unitPrice"){
      const existingDetail = this.currentAdjustment.updatePricing(existingDetailIndex, value);
      this.updateDataSourceItems(existingDetailIndex, existingDetail);
    }

    if (column === "warehouseId" && value !== oldValue) {
      Swal.fire({
        icon: 'warning',
        html: `¿Estas seguro de cambiar la bodega?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then(result => {
        let warehouseId = value;
        if (!result.isConfirmed) {
         warehouseId = oldValue;
        }
        const existingDetail = this.currentAdjustment.updateWarehouseId(existingDetailIndex, warehouseId);
        this.updateDataSourceItems(existingDetailIndex, existingDetail);
      })
      return
    }

  }


  onSubmit(){


  }
  close(){
    this.dialogRef.close();
  }
}
