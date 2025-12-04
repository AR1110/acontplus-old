import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabulatorTable } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { Button } from '@acontplus/ng-components';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { ItemSearch } from '@restaurant/ui/items/item-search/item-search';
import {
  ItemGetBydIdUseCase,
  ItemUpdateUseCase,
} from '@restaurant/application/use-cases/item.use-case';
import { GetProductSaleUseCase } from '@inventory/product/application/use-cases/product/get-product.use-case';
import { ProductMeasure } from '@inventory/domain/models/product-measure';
import { ItemComposition } from '@restaurant/domain/models/item-composition';
import DecimalUtil from '@core/utils/decimal.util';
import { CATEGORY_ABBREVIATIONS } from '@restaurant/domain/enums/restaurant.enum';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {generateUuidv4} from "@core/utils/generate-uuidv4";
import {Overlay} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {ItemSearchDialog} from "@restaurant/ui/items/item-search-dialog/item-search-dialog";

@Component({
  selector: 'app-item-add-edit',
  imports: [
    ReactiveFormsModule,
    TabulatorTable,
    Button,
    MatCustomDialogComponent,
    MatInputModule,
    ItemSearch,
    MatIconButton,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './item-add-edit.html',
  styles: ``,
})
export class ItemAddEdit implements OnInit {
  private itemGetByIdUseCase = inject(ItemGetBydIdUseCase);
  private productSaleUseCase = inject(GetProductSaleUseCase);
  private updateUseCase = inject(ItemUpdateUseCase);
  #modalRef = inject(MatDialogRef<ItemAddEdit>);
  #tS = inject(ToastrNotificationService);
  overlay = inject(Overlay);

  params = inject<{ id: number; acronymCategory: string }>(MAT_DIALOG_DATA);
  itemForm!: FormGroup;
  itemCompositions = signal<any[]>([
    {
      uuid: generateUuidv4(),
      id: 1,
      parentItemId: 0,
      childItemId: 0,
      fees: [],
      _children: [],
      feeId: 0,
      description: 'Producto 1',
      code: 'COD-1',
      measures: [],
      measureId: 0,
      salePrice: 10,
      unitPrice: 8,
      quantity: 1,
      totalPrice: 10,
      totalCost: 8,
      isActive: true,
      isDeleted: false
    },
    {
      uuid: generateUuidv4(),
      id: 2,
      parentItemId: 0,
      childItemId: 0,
      fees: [],
      feeId: 0,
      description: 'Producto 2',
      code: 'COD-2',
      measures: [],
      measureId: 0,
      salePrice: 20,
      unitPrice: 16,
      quantity: 2,
      totalPrice: 40,
      totalCost: 32,
      isActive: true,
      isDeleted: false,
      _children: [],
    },
    {
      uuid: generateUuidv4(),
      id: 3,
      parentItemId: 0,
      childItemId: 0,
      fees: [],
      feeId: 0,
      description: 'Producto 3',
      code: 'COD-3',
      measures: [],
      measureId: 0,
      salePrice: 30,
      unitPrice: 24,
      quantity: 3,
      totalPrice: 90,
      totalCost: 72,
      isActive: true,
      isDeleted: false,
      _children: [],
    },
    {
      uuid: generateUuidv4(),
      id: 4,
      parentItemId: 0,
      childItemId: 0,
      fees: [],
      feeId: 0,
      description: 'Producto 4',
      code: 'COD-4',
      measures: [],
      measureId: 0,
      salePrice: 40,
      unitPrice: 32,
      quantity: 4,
      totalPrice: 160,
      totalCost: 128,
      isActive: true,
      isDeleted: false,
      _children: [],
    },
    {
      uuid: generateUuidv4(),
      id: 5,
      parentItemId: 0,
      childItemId: 0,
      fees: [],
      feeId: 0,
      description: 'Producto 5',
      code: 'COD-5',
      measures: [],
      measureId: 0,
      salePrice: 50,
      unitPrice: 40,
      quantity: 5,
      totalPrice: 250,
      totalCost: 200,
      isActive: true,
      isDeleted: false,
      _children: [],
    },
    {
      uuid: generateUuidv4(),
      id: 6,
      parentItemId: 0,
      childItemId: 0,
      fees: [],
      feeId: 0,
      description: 'Producto 6',
      code: 'COD-6',
      measures: [],
      measureId: 0,
      salePrice: 60,
      unitPrice: 48,
      quantity: 6,
      totalPrice: 360,
      totalCost: 288,
      isActive: true,
      isDeleted: false,

      _children: [
        {
          id: 5,
          description: 'Hijo 2-1',
          salePrice: 25,
          quantity: 2,
          totalPrice: 50,
        },
        {
          id: 6,
          description: 'Hijo 2-2',
          salePrice: 40,
          quantity: 1,
          totalPrice: 40,
        }
      ]
    }
]);
  itemCompositionsDeleted = signal<ItemComposition[]>([]);

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    const column: any = cell.getColumn().getField();
    const data: any = cell.getData();
    // const oldValue = cell.getOldValue();
    // const value = cell.getValue();

    const editor: any = document.createElement('select');

    if (column === 'measureId') {
      for (const m of data.measures || []) {
        const opt = document.createElement('option');
        opt.value = m.id.toString();
        opt.innerHTML = m.name;
        editor.appendChild(opt);
      }
    }

    if (column === 'feeId') {
      for (const t of data.fees || []) {
        const opt = document.createElement('option');
        opt.value = t.id.toString();
        opt.innerHTML = t.name + ' - $' + t.priceWithTax;
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
        delBtn.classList.add('small-button', 'btn-remove', 'text-white');
        delBtn.addEventListener('click', () => {
          this.deleteRow(rowData);
        });
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
      width: 100,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: this.isProduct() ? 'Ingrediente' : 'Producto',
      field: 'description',
      width: 280,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      cellClick: (e:any, cell:any) => this.openOverlay(cell.getRow().getData())
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
        for (const m of data.measures ?? []) {
          if (m.id == cell.getValue()) {
            return m.name;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },

    //start when is product combo
    {
      title: 'Tarifa',
      field: 'feeId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const m of data.fees ?? []) {
          if (m.id == cell.getValue()) {
            return m.name;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },

    {
      title: 'Cant.',
      field: 'quantity',
      width: 80,
      editor: true,
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: 'Precio Venta',
      field: 'salePrice',
      editor: false,
      width: 120,
      widthGrow: 1,
      validator: ['numeric'],
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
    },
    // {
    //   title: 'Precio costo',
    //   field: 'unitPrice',
    //   width: 120,
    //   editor: false,
    //   hozAlign: 'center',
    //   headerSort: false,
    //   headerHozAlign: 'center',
    //   editorParams: {
    //     selectContents: true,
    //     verticalNavigation: 'table',
    //   },
    // },

    {
      title: 'Total Precio',
      field: 'totalPrice',
      width: 120,
      editor: false,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table',
      },
    },
  ];

  isProduct(): boolean {
    return this.params?.acronymCategory === CATEGORY_ABBREVIATIONS.RESTAURANT;
  }

  isCombo(): boolean {
    return this.params?.acronymCategory === CATEGORY_ABBREVIATIONS.COMBO;
  }

  isIngredient(): boolean {
    return this.params?.acronymCategory === CATEGORY_ABBREVIATIONS.INGREDIENT;
  }

  getCategoryAbbreviationToSearch() {
    if (this.isProduct()) {
      return CATEGORY_ABBREVIATIONS.INGREDIENT;
    }
    if (this.isCombo()) {
      return CATEGORY_ABBREVIATIONS.RESTAURANT;
    }
    return '';
  }

  rowDeleted(row: any) {
    const closeItemCompositions = JSON.parse(JSON.stringify(this.itemCompositions()));
    const data = row.getData();
    this.itemCompositions.set(closeItemCompositions.filter((x: any) => x.uuid !== data.uuid));
  }

  itemSearchLabel = this.isCombo() ? 'Buscar Producto' : 'Buscar Ingrediente';
  openOverlay(rowData: any) {
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position()
        .global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });

    const portal = new ComponentPortal(ItemSearchDialog);
    const component = overlayRef.attach(portal);

  //  component.instance.data = rowData;

    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  }

  ngOnInit() {
    if (this.isProduct()) {
      this.itemForm = new FormGroup({
        id: new FormControl(0),
        summary: new FormControl('', [Validators.required]),
        recipe: new FormControl(''),
        instructions: new FormControl(''),
        cooking: new FormControl(false),
        productId: new FormControl(0),
        isActive: new FormControl(true),
      });
    }

    if (this.isCombo()) {
      this.itemForm = new FormGroup({
        id: new FormControl(0),
        summary: new FormControl(''),
        isActive: new FormControl(true),
      });
    }

    this.getItemById();
  }

  async cellEdited(cell: any): Promise<void> {
    const column = cell.getColumn().getField();
    const oldValue = parseFloat(cell.getOldValue());
    const newValue = parseFloat(cell.getValue());
    const data = { ...cell.getData() }; // copia superficial
    const oldData = cell.getRow().getData();

    if (newValue === oldValue || isNaN(newValue) || cell.getValue() === '' || newValue < 0) {
      data[column] = oldValue;
      return;
    }

    if (column === 'measureId') {
      const dataMeasure = data.measures.find((x: any) => x.measureId === Number(newValue));
      if (dataMeasure) {
        data.unitPrice = dataMeasure.costPrice;
      } else {
        data.unitPrice = oldValue;
      }
    }

    if (column == 'feeId') {
      const dataFee = data.fees.find((x: any) => x.id == data.feeId);
      if (dataFee) {
        data.salePrice = dataFee.salePrice;
      }
    }
    data.totalPrice = DecimalUtil.multiplyAsNumber(data.quantity, data.salePrice);

    this.itemCompositions.set(
      this.itemCompositions().map((item) => (item.uuid === data.uuid ? data : item)),
    );
  }

  private getItemById() {
    this.itemGetByIdUseCase.execute(this.params.id).subscribe((response) => {
      this.itemForm.patchValue(response.item);
     // this.itemCompositions.set(response.itemCompositions);
    });
  }

  onSelectItem(rowData: any): void {
    if (!rowData?.productId) return;

    this.productSaleUseCase.execute({ id: rowData.productId }).subscribe({
      next: (response) => {
        const { product, taxRates, measures } = response;
        if (!product || !Array.isArray(measures) || !Array.isArray(taxRates)) return;

        const compositions = structuredClone(this.itemCompositions());
        const existingIndex = compositions.findIndex((x) => x.childItemId === rowData.id);

        const getDefaultMeasure = (): ProductMeasure | undefined =>
          measures.find((m) => m.defaultMeasure);

        const getDefaultFee = (measure?: ProductMeasure) => measure?.fees?.find((f) => f.isDefault);

        if (existingIndex === -1) {
          const defaultMeasure = getDefaultMeasure();
          const defaultFee = getDefaultFee(defaultMeasure);

          if (!defaultMeasure || !defaultFee) {
            console.error('Datos incompletos para crear la composición del producto.');
            return;
          }

          const newComposition = new ItemComposition();
          newComposition.code = product.code;
          newComposition.parentItemId = this.params.id;
          newComposition.childItemId = rowData.id;
          newComposition.measures = measures;
          newComposition.measureId = defaultMeasure.id;
          newComposition.feeId = defaultFee.id;
          newComposition.salePrice = defaultFee.salePrice;
          newComposition.fees = defaultMeasure.fees ?? [];
          newComposition.description = product.descripcion;
          newComposition.unitPrice = defaultMeasure.costPrice;

          newComposition.totalPrice = DecimalUtil.multiplyAsNumber(
            newComposition.quantity,
            newComposition.salePrice,
          );

          compositions.push(newComposition);
        } else {
          const existing = compositions[existingIndex];
          existing.quantity += 1;
          existing.totalPrice = DecimalUtil.multiplyAsNumber(existing.quantity, existing.salePrice);
        }

        this.itemCompositions.set(compositions);
      },
      error: (err) => console.error('Error al obtener el producto:', err),
    });
  }

  async deleteRow(rowData: ItemComposition) {
    const { isConfirmed } = await Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (isConfirmed) {
      const cloneItemCompositions = JSON.parse(JSON.stringify(this.itemCompositions()));
      this.itemCompositions.set(cloneItemCompositions.filter((x: any) => x.uuid !== rowData.uuid));

      if (rowData.id > 0) {
        this.itemCompositionsDeleted.update((x: any) => [
          ...x,
          {
            ...rowData,
            isActive: false,
            isDeleted: true,
          },
        ]);
      }
    }
  }

  generateDescription() {
    const summary = this.itemCompositions()
      .map((item) => item.quantity + ' ' + item.description)
      .join(', ');

    this.itemForm.get('summary')?.setValue(summary);
  }

  onSave() {
    if (this.itemForm.invalid) {
      return this.#tS.show({
        type: 'warning',
        message: 'Revise los datos ingresados',
      });
    }
    const dataToSave = {
      item: this.itemForm.value,
      itemCompositions: [...this.itemCompositions(), ...this.itemCompositionsDeleted()],
      isProduct: this.isProduct(),
      isCombo: this.isCombo(),
    };
    this.updateUseCase
      .execute({
        id: this.params.id,
        data: dataToSave,
      })
      .subscribe((response) => {
        Swal.fire({
          icon: response.code === '1' ? 'success' : 'warning',
          html: response.message,
        });
        if (response.code === '1') {
          this.#modalRef.close(response);
        }
      });
  }

  onModalClose() {
    this.#modalRef.close();
  }
}
