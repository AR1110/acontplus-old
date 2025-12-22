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
import { PRODUCT_SERVICE } from '@inventory/data/inventory-token';
import { ProductMeasure } from '@inventory/data/models/product-measure';
import { ItemComposition } from '@restaurant/domain/models/item-composition';
import DecimalUtil from '@core/utils/decimal.util';
import { CATEGORY_ABBREVIATIONS } from '@restaurant/domain/enums/restaurant.enum';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ItemSearchDialog } from '@restaurant/ui/items/item-search-dialog/item-search-dialog';

@Component({
  selector: 'app-item-variant-add-edit',
  imports: [
    ReactiveFormsModule,
    TabulatorTable,
    Button,
    MatCustomDialogComponent,
    MatInputModule,
    ItemSearch,
  ],
  templateUrl: './item-variant-add-edit.html',
  styles: ``,
})
export class ItemVariantAddEdit implements OnInit {
  private itemGetByIdUseCase = inject(ItemGetBydIdUseCase);
  private productService = inject(PRODUCT_SERVICE);
  private updateUseCase = inject(ItemUpdateUseCase);
  #modalRef = inject(MatDialogRef<ItemVariantAddEdit>);
  #tS = inject(ToastrNotificationService);
  overlay = inject(Overlay);

  params = inject<{ id: number; acronymCategory: string }>(MAT_DIALOG_DATA);
  itemForm!: FormGroup;
  itemCompositions = signal<ItemComposition[]>([]);
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
        console.log(rowData);

        // Contenedor de botones
        const buttonHolder = document.createElement('div');
        buttonHolder.style.display = 'flex';
        buttonHolder.style.gap = '6px';
        buttonHolder.style.justifyContent = 'center';
        buttonHolder.style.alignItems = 'center';

        // Botón Eliminar
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.classList.add('small-button', 'btn-remove', 'text-white');
        delBtn.setAttribute('title', 'Eliminar');
        delBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path d="M3 6h18" stroke="currentColor" stroke-width="2"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" stroke-width="2"/>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
        delBtn.addEventListener('click', () => this.deleteRow(rowData));

        // Botón Configuración
        const settingBtn = document.createElement('button');
        settingBtn.type = 'button';
        settingBtn.classList.add('small-button', 'btn-setting', 'text-white');
        settingBtn.setAttribute('title', 'Configurar');
        settingBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" stroke-width="2"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
        settingBtn.addEventListener('click', () => this.openOverlay(rowData));

        buttonHolder.appendChild(delBtn);
        // if(rowData && rowData.children){
        //   buttonHolder.appendChild(settingBtn);
        // }

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

  getCategoryAbbreviationToSearch() {
    return CATEGORY_ABBREVIATIONS.RESTAURANT;
  }

  rowDeleted(row: any) {
    const closeItemCompositions = JSON.parse(JSON.stringify(this.itemCompositions()));
    const data = row.getData();
    this.itemCompositions.set(closeItemCompositions.filter((x: any) => x.uuid !== data.uuid));
  }

  itemSearchLabel = this.isCombo() ? 'Buscar Producto' : 'Buscar Ingrediente';

  openOverlay(rowData: any) {
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });

    const portal = new ComponentPortal(ItemSearchDialog);
    const componentRef = overlayRef.attach(portal);

    // ✅ Pasar datos al componente
    componentRef.instance.data = rowData;

    // ✅ Suscribirse al evento de cierre
    componentRef.instance.closed.subscribe((result: any) => {
      if (result && typeof result === 'object') this.onSelectItemChildren(result, rowData);
      overlayRef.dispose(); // cerrar overlay
    });

    // ✅ Cerrar al hacer click en el backdrop
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

    this.productService.getForSale({ id: rowData.productId }).subscribe({
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
          newComposition.children = [];

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

  onSelectItemChildren(rowData: any, parentData: ItemComposition): void {
    if (!rowData?.productId) return;

    this.productService.getForSale({ id: rowData.productId }).subscribe({
      next: (response) => {
        const { product, taxRates, measures } = response;
        if (!product || !Array.isArray(measures) || !Array.isArray(taxRates)) return;

        const compositions = structuredClone(this.itemCompositions());
        const compositionsChildren =
          compositions.find((c) => c.uuid === parentData.uuid)?.children ?? [];

        const existingIndex = compositionsChildren.findIndex((x) => x.childItemId === rowData.id);

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
          newComposition.parentCompositionId = parentData.childItemId;
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

          compositionsChildren.push(newComposition);
        } else {
          const existing = compositionsChildren[existingIndex];
          existing.quantity += 1;
          existing.totalPrice = DecimalUtil.multiplyAsNumber(existing.quantity, existing.salePrice);
        }

        this.itemCompositions.update((items) =>
          items.map((itm) =>
            itm.uuid === parentData.uuid
              ? {
                  ...itm,
                  isOptional: true,
                  children: compositionsChildren,
                } // crear nuevo objeto
              : itm,
          ),
        );
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
    const itemCompositionsChildren = this.itemCompositions().flatMap((x) => x.children);
    const dataToSave = {
      item: this.itemForm.value,
      itemCompositions: [
        ...this.itemCompositions(),
        ...itemCompositionsChildren,
        ...this.itemCompositionsDeleted(),
      ],
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
