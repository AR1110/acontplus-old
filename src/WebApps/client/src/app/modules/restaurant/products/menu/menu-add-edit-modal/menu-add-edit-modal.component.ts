import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Menu } from '@restaurant/models/menu.model';
import { MenuService } from '@restaurant/services/menu.service';
import { MenuItemService } from '@restaurant/services/menu-item.service';
import { ItemService } from '@restaurant/services/item.service';
import { ToasterService } from '@core/services/toaster.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IngredientSearchComponent } from '@restaurant/products/ingredient/ingredient-search/ingredient-search.component';
import { ItemSearchComponent } from '@restaurant/products/item/item-search/item-search.component';
import { Item } from '@restaurant/models/item.model';

@Component({
  selector: 'app-menu-add-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggle,
    IngredientSearchComponent,
    ItemSearchComponent,
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
  @Input() data: Menu = {} as Menu;
  @Input() menuTypes: any[] = [];
  productsAdded: any[] = [];
  itemSearch: string = '';
  value = '';
  placeholder = 'Buscar producto';
  timeout: any;
  validation = [undefined, null, 0, ''];
  private readonly _menuService = inject(MenuService);
  private readonly _menuItemService = inject(MenuItemService);
  private readonly _itemService = inject(ItemService);
  private readonly _tS = inject(ToasterService);
  private readonly _modalRef = inject(NgbActiveModal);

  getItems(id: number) {
    this._menuItemService.getByMenu(id, { tipo: 1 }).subscribe((response) => {
      if (response) {
        this.productsAdded = response.menusItems;
        this.verifyUpdateCell(this.productsAdded);
      }
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

  onInput(event: any) {
    this.value = event.target.value;
    // this.itemSearch = [];

    if (this.value.length <= 3 || this.validation.includes(this.value)) return;

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let json = {
        pageIndex: 1,
        pageSize: 10,
        tipo: 1,
        textSearch: this.value,
      };

      this._itemService.get(JSON.stringify(json)).subscribe((response) => {
        if (response) {
          this.itemSearch = response['items'];
        }
      });
    }, 300);
  }

  getItemSearch(id: number, data: any) {
    // const item = this.itemSearch.find((x: any) => x.id === id);
    // const itemExists = this.productsAdded.find(
    //   (x: any) => x.productId === item.productId,
    // );
    // if (itemExists) {
    //   return this._tS.toastr({
    //     type: 'warning',
    //     message: 'Ya existe agregado para el combo',
    //   });
    // }
    //
    // let newMenuItem = {
    //   id: 0,
    //   itemId: item.id,
    //   productId: item.productId,
    //   costPrice: item.costPrice,
    //   descripcion: item.descripcion,
    //   codigo: item.codigo,
    //   medida: item.medida,
    //   menuId: data.id,
    //   feeId: 0,
    //   quantity: 0,
    //   discountPercent: 0,
    //   discountValue: 0,
    //   subtotal: 0,
    // };
    //
    // this.getTarifaById(newMenuItem.productId, newMenuItem);
    //
    // this.value = '';
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

  onModalClose() {
    this.productsAdded = [];
    this._modalRef.close();
  }

  onUpdate() {
    if (!this.onValidate()) return;

    let forSave = {
      ...this.data,
      menuItems: this.productsAdded,
    };

    this._menuService
      .put(this.data.id, { data: forSave })
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

  onItemSelected($event: { item: Item }) {}
}
