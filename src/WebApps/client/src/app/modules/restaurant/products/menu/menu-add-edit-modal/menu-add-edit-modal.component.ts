import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Menu, MenuType } from '@restaurant/models/menu.model';
import { MenuService } from '@restaurant/services/menu.service';
import { MenuItemService } from '@restaurant/services/menu-item.service';
import { ToasterService } from '@core/services/toaster.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IngredientSearchComponent } from '@restaurant/products/ingredient/ingredient-search/ingredient-search.component';
import { ItemSearchComponent } from '@restaurant/products/item/item-search/item-search.component';
import { Item } from '@restaurant/models/item.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';

@Component({
  selector: 'app-menu-add-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggle,
    IngredientSearchComponent,
    ItemSearchComponent,
    FaIconComponent,
    TabulatorSemanticUiComponent,
  ],
  templateUrl: './menu-add-edit-modal.component.html',
  styles: ``,
})
export class MenuAddEditModalComponent {
  menuForm = new FormGroup({
    id: new FormControl(0),
    title: new FormControl(''),
    forPromotion: new FormControl(false),
    summary: new FormControl(''),
  });
  data = {} as Menu;
  menuTypes: MenuType[] = [];
  modalIcon: IconProp = 'plus';
  modalTitle: string = 'Registrar Menu';
  productsAdded: any[] = [];

  itemSearch: string = '';
  placeholder = 'Buscar producto';
  validation = [undefined, null, 0, ''];
  private readonly _menuService = inject(MenuService);
  private readonly _menuItemService = inject(MenuItemService);
  private readonly _tS = inject(ToasterService);
  private readonly _modalRef = inject(NgbActiveModal);

  // Todo: GRID COLUMNS
  selectFee = (cell: any, onRendered: any, success: any, cancel: any) => {
    let fees = [];
    let rows = cell.getRow().getData();

    if (rows.fees === undefined) fees = [];
    if (rows.fees != undefined) fees = JSON.parse(rows.fees);

    let selectList = document.createElement('select');
    selectList.style.width = '100%';
    selectList.style.boxSizing = 'border-box';

    onRendered(function () {
      selectList.focus();
      selectList.style.height = '100%';
    });

    function onChange() {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.tarifa = selectList.selectedOptions[0].text;
        cell.getElement().dataset.feeId = selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    }

    selectList.addEventListener('blur', onChange);

    for (let i = 0; i < fees.length; i++) {
      let option = document.createElement('option');

      option.value = fees[i].idTarifa.toString();
      option.text = fees[i].tarifa;
      if (fees[i].idMedida === rows) {
        option.selected = true;
      }
      selectList.appendChild(option);
    }
    return selectList;
  };

  formatterFee = (cell: any) => {
    let fees = [];
    let row = cell.getRow().getData();
    let value = cell.getValue();

    fees = JSON.parse(row.fees);
    return fees.find((x: any) => x.idTarifa == value).tarifa;
  };

  calculateTotal = (cell: any) => {
    let row = cell.getRow().getData();
    let porcentaje = 0;
    let descuento = 0;
    let totalDiscount = 0;

    let column = cell.getColumn()._column.field;

    if (column === 'feeId') {
      let fee = JSON.parse(row.fees).find((x: any) => x.idTarifa == row.feeId);

      cell.getRow().update({
        priceIVA: fee.precioConIva,
        price: fee.precioVenta,
      });
    }

    if (column === 'quantity') {
      if (row.quantity >= 0) {
        cell.getRow().update({ quantity: row.quantity });
      } else {
        let oldValue = cell.getOldValue();
        cell.getRow().update({ quantity: oldValue });
      }
    }

    if (column === 'discountPercent') {
      if (row.discountPercent >= 0 && row.discountPercent <= 100) {
        porcentaje = row.discountPercent / 100;
        descuento = row.priceIVA * porcentaje;

        if (!this.validation.includes(descuento)) {
          descuento = parseFloat(descuento.toFixed(2));
        }

        cell.getRow().update({
          discountPercent: row.discountPercent,
          discountValue: descuento,
        });
      } else {
        let oldValue = cell.getOldValue();
        cell.getRow().update({ discountPercent: oldValue });
        return this._tS.toastr({
          type: 'warning',
          message: 'El descuento no puede ser mayor al 100%',
        });
      }
    }
    totalDiscount = (row.priceIVA - row.discountValue) * row.quantity;
    if (!this.validation.includes(totalDiscount)) {
      totalDiscount = parseFloat(totalDiscount.toFixed(2));
    }
    cell.getRow().update({ subtotal: totalDiscount });
  };
  productColumns = [
    {
      editable: 'never',
      field: 'descripcion',
      title: 'Producto',
      with: 300,
    },
    {
      editable: 'never',
      field: 'codigo',
      hozAlign: 'center',
      title: 'Código',
      with: 100,
    },
    {
      editable: 'never',
      field: 'medida',
      hozAlign: 'center',
      title: 'Medida',
      with: 100,
    },
    {
      editor: this.selectFee,
      formatter: this.formatterFee,
      cellEdited: this.calculateTotal,
      field: 'feeId',
      hozAlign: 'center',
      title: 'Tarifa',
      typeNumber: true,
      with: 100,
    },
    {
      editable: 'never',
      field: 'priceIVA',
      hozAlign: 'center',
      title: 'Precio IVA',
      with: 100,
    },
    // {
    //   field: "price",
    //   hozAlign: "center",
    //   title: "Precio Venta",
    //   with: 200,
    // },
    {
      editor: 'input',
      field: 'quantity',
      hozAlign: 'center',
      title: 'Cantidad',
      sorter: 'number',
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      cellEdited: this.calculateTotal,
      with: 200,
    },
    {
      editor: 'input',
      field: 'discountPercent',
      title: 'Desc. %',
      sorter: 'number',
      hozAlign: 'center',
      with: 200,
      cellEdited: this.calculateTotal,
    },
    {
      editable: 'never',
      field: 'discountValue',
      title: 'Valor Descuento',
      hozAlign: 'center',
      with: 200,
      calcBottom: 'sum',
      bottomCalc: function (data: any) {
        let discountValue = 0;
        data.forEach((element: any) => {
          discountValue += element;
        });

        // if (!this.validation.includes(discountValue)) {
        //   discountValue = parseFloat(discountValue.toFixed(2));
        // } else {
        //   discountValue = 0;
        // }
        return discountValue;
      },
    },
    {
      calcBottom: 'sum',
      editable: false,
      editor: 'input',
      field: 'subtotal',
      hozAlign: 'center',
      title: 'Subtotal',
      with: 100,
      bottomCalc: function (data: any) {
        let subtotal = 0;
        data.forEach((element: any) => {
          subtotal += element;
        });

        // if (!this.validation.includes(subtotal)) {
        //   subtotal = parseFloat(subtotal.toFixed(2));
        // } else {
        //   subtotal = 0;
        // }
        return subtotal;
      },
    },
    {
      cellClick: (e: any, cell: any) => {
        this.removeFromList(cell.getData().itemId);
        cell.getRow().delete();
      },
      formatter: 'buttonCross',
      hozAlign: 'center',
      resizable: false,
      title: 'Opción',
      width: 100,
    },
  ];

  getItems(id: number) {
    this._menuItemService.getByMenu(id, { tipo: 1 }).subscribe((response) => {
      this.productsAdded = response.menuItems;
      this.verifyUpdateCell(this.productsAdded);
    });
  }

  verifyUpdateCell(productsAdded: any[]) {
    if (productsAdded.length > 0) {
      for (let product of productsAdded) {
        let fee = JSON.parse(product.fees).find(
          (x: any) => x.idTarifa == product.feeId,
        );
        product.priceIVA = fee.precioConIva;
        product.price = fee.precioVenta;
      }
    }
  }

  getTarifaById(productId: number, newMenuItem: any) {
    this._menuItemService
      .getByMenu(0, { productId: productId, tipo: 2 })
      .subscribe((response) => {
        if (response) {
          let newFees = response['tarifas'];

          newFees.forEach((e: any) => {
            if (e.precioPredeterminado) {
              newMenuItem.feeId = e.idTarifa;
              newMenuItem.priceIVA = e.precioConIva;
              newMenuItem.price = e.precioVenta;
            }
          });

          this.productsAdded.forEach((e) => {
            if (this.validation.includes(e.price)) {
              e.price = 0;
            }

            if (this.validation.includes(e.priceIVA)) {
              e.priceIVA = 0;
            }
          });

          newMenuItem.fees = JSON.stringify(newFees);
          this.productsAdded = [...this.productsAdded, newMenuItem];
        }
      });
  }

  removeFromList(itemId: number) {
    this.productsAdded = this.productsAdded.filter((x) => x.itemId !== itemId);
  }

  ngOnInit() {
    if (this.data.id > 0) {
      this.getItems(this.data.id);
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Menu';
      this.menuForm.patchValue(this.data);
    }
  }

  onModalClose() {
    this.productsAdded = [];
    this._modalRef.close();
  }

  onSave() {
    if (!this.onValidate()) return;

    const dataToSave = {
      ...this.data,
      menuItems: this.productsAdded,
    };

    this._menuService
      .put(this.data.id, { data: dataToSave })
      .subscribe((response) => {
        this._tS.toastr({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          this._modalRef.close(response);
        }
      });
  }

  onValidate(): boolean {
    let isValid = true;
    if (this.productsAdded.length <= 0) {
      this._tS.toastr({
        type: 'warning',
        message: 'Debe agregar productos para crear el combo',
      });
      isValid = false;
    }
    return isValid;
  }

  generateDescription() {
    this.data.summary = this.productsAdded
      .map((item) => item.quantity + ' ' + item.descripcion)
      .join(', ');
  }

  onItemSelected($event: { item: Item }) {
    const itemExists = this.productsAdded.find(
      (x: any) => x.productId === $event.item.productId,
    );
    if (itemExists) {
      return this._tS.toastr({
        type: 'warning',
        message: 'Ya existe agregado para el combo',
      });
    }

    let newMenuItem = {
      id: 0,
      itemId: $event.item.id,
      productId: $event.item.productId,
      costPrice: $event.item.costPrice,
      descripcion: $event.item.descripcion,
      codigo: $event.item.codigo,
      medida: $event.item.medida,
      menuId: this.data.id,
      feeId: 0,
      quantity: 0,
      discountPercent: 0,
      discountValue: 0,
      subtotal: 0,
    };

    this.getTarifaById($event.item.productId, newMenuItem);
  }
}
