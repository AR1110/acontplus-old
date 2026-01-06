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
import { CATEGORY_ABBREVIATIONS } from '@restaurant/restaurant-const';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ItemSearchDialog } from '@restaurant/ui/items/item-search-dialog/item-search-dialog';

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
  private productService = inject(PRODUCT_SERVICE);
  private updateUseCase = inject(ItemUpdateUseCase);
  #modalRef = inject(MatDialogRef<ItemAddEdit>);
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
        if (rowData && rowData.children) {
          buttonHolder.appendChild(settingBtn);
        }

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
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });

    const portal = new ComponentPortal(ItemSearchDialog);
    const componentRef = overlayRef.attach(portal);

    componentRef.instance.data = rowData;

    componentRef.instance.closed.subscribe((result: any) => {
      if (result && typeof result === 'object') this.onSelectItemChildren(result, rowData);
      overlayRef.dispose(); // cerrar overlay
    });

    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
  }

  ngOnInit() {
    if (this.isProduct()) {
      this.itemForm = new FormGroup({
        id: new FormControl(0),
        summary: new FormControl('', [Validators.required]),
        recipe: new FormControl(''),
        preparationInstructions: new FormControl(''),
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
    const rawOld = cell.getOldValue();
    const rawNew = cell.getValue();
    const data = { ...cell.getData() };

    const numericColumns = ['quantity', 'salePrice', 'unitPrice'];

    if (numericColumns.includes(column)) {
      const value = Number(rawNew);
      if (isNaN(value) || value < 0) {
        cell.setValue(rawOld, true);
        return;
      }
      data[column] = value;
    }

    if (column === 'measureId') {
      const measureId = Number(rawNew);
      const dataMeasure = data.measures.find((x: any) => x.id === measureId);
      if (dataMeasure) data.unitPrice = dataMeasure.costPrice;
    }

    if (column === 'feeId') {
      const feeId = Number(rawNew);
      const dataFee = data.fees.find((x: any) => x.id === feeId);
      if (dataFee) data.salePrice = dataFee.salePrice;
    }

    data.totalPrice = DecimalUtil.multiplyAsNumber(data.quantity, data.salePrice);
    data.totalCost = DecimalUtil.multiplyAsNumber(data.quantity, data.unitPrice);

    // ✅ SOLO modificar la fila exacta (padre, hijo o nieto)
    const list = structuredClone(this.itemCompositions());
    this.updateTreeRowOnly(list, data);
    this.itemCompositions.set(list);
  }

  private updateTreeRowOnly(list: any[], data: any): boolean {
    for (const item of list) {
      // ✅ Si es el nodo exacto (padre, hijo o nieto)
      if (item.uuid === data.uuid) {
        Object.assign(item, data);
        return true; // ya se actualizó
      }

      // ✅ Si tiene hijos, buscar recursivamente
      if (item.children?.length) {
        const updated = this.updateTreeRowOnly(item.children, data);
        if (updated) return true;
      }
    }

    return false;
  }

  private getItemById() {
    this.itemGetByIdUseCase.execute(this.params.id).subscribe((response) => {
      this.itemForm.patchValue(response.item);
      this.itemCompositions.set(response.itemCompositions);
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
        const { product, measures: measuresTemp, taxRates } = response;
        if (!product || !Array.isArray(measuresTemp) || !Array.isArray(taxRates)) return;

        const measures: ProductMeasure[] = measuresTemp;
        const defaultMeasure = measures.find((m) => m.defaultMeasure);
        const defaultFee = defaultMeasure?.fees?.find((f) => f.isDefault);

        if (!defaultMeasure || !defaultFee) {
          console.error('Datos incompletos para crear la composición del producto.');
          return;
        }

        const newComposition = new ItemComposition();
        newComposition.parentUuid = parentData.uuid;
        newComposition.code = product.code;
        newComposition.parentItemId = this.params.id;
        newComposition.parentCompositionId = parentData.parentCompositionId;
        newComposition.childItemId = rowData.id;
        newComposition.parentUuid = parentData.uuid;
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

        const compositions = this.addOrUpdateChild(
          structuredClone(this.itemCompositions()),
          parentData.uuid,
          newComposition,
        );

        this.itemCompositions.set(compositions);
      },
      error: (err) => console.error('Error al obtener el producto:', err),
    });
  }

  private addOrUpdateChild(
    compositions: ItemComposition[],
    parentUuid: string,
    newChild: ItemComposition,
  ): ItemComposition[] {
    return compositions.map((node) => {
      if (node.uuid === parentUuid) {
        node.children = node.children ?? [];

        const existingIndex = node.children.findIndex(
          (x) => x.childItemId === newChild.childItemId,
        );

        if (existingIndex === -1) {
          newChild.level = node.level + 1;
          node.children.push(newChild);
        } else {
          const existing = node.children[existingIndex];
          existing.quantity += newChild.quantity;
          existing.totalPrice = DecimalUtil.multiplyAsNumber(existing.quantity, existing.salePrice);
        }

        return { ...node, isOptional: true, children: node.children };
      } else if (node.children) {
        return { ...node, children: this.addOrUpdateChild(node.children, parentUuid, newChild) };
      }
      return node;
    });
  }

  private deleteCompositionByUuid(items: ItemComposition[], uuid: string): ItemComposition[] {
    return (
      items
        // eliminar el nodo actual si coincide con el uuid
        .filter((item) => item.uuid !== uuid)
        .map((item) => ({
          ...item,
          // si tiene hijos, aplicar recursivamente
          children: item.children ? this.deleteCompositionByUuid(item.children, uuid) : [],
        }))
    );
  }

  async deleteRow(rowData: ItemComposition) {
    const { isConfirmed } = await Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    });

    if (!isConfirmed) return;

    // Eliminar recursivamente del árbol principal
    this.itemCompositions.update((items) => this.deleteCompositionByUuid(items, rowData.uuid));

    if (rowData.id > 0) {
      const collectAllDescendants = (item: ItemComposition): ItemComposition[] => {
        let all: ItemComposition[] = [{ ...item, isActive: false, isDeleted: true }];
        if (item.children) {
          for (const child of item.children) {
            all = all.concat(collectAllDescendants(child));
          }
        }
        return all;
      };

      const allDeleted = collectAllDescendants(rowData);
      this.itemCompositionsDeleted.update((x) => [...x, ...allDeleted]);
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
    const itemCompositions = this.itemCompositions().map((x) => ({
      ...x,
      isOptional: (x.children ?? [])?.length > 0,
    }));
    const dataToSave = {
      item: this.itemForm.value,
      itemCompositions: [
        ...itemCompositions,
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
          timer: 1000,
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
