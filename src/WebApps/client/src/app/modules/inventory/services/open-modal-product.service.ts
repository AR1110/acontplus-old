import { inject, Injectable } from '@angular/core';
import { ProductKardexComponent } from '@inventory/ui/product/components/product-kardex/product-kardex.component';
import { AddEditProduct } from '@inventory/ui/product/components/add-edit-product/add-edit-product';
import { DialogService } from '@core/services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class OpenModalProductService {
  private readonly _dialogService = inject(DialogService);

  async open<T extends { id: number }>(data?: T) {
    const dialogRef = this._dialogService.open(AddEditProduct, {
      size: 'xl',
      data: {
        id: data?.id,
      },
    });

    dialogRef.subscribe((result) => {
      return result;
    });
  }

  async openKardex<T extends { id: number }>(data?: T) {
    const dialogRef = this._dialogService.open(ProductKardexComponent, {
      size: 'xl',
      data: {
        id: data?.id,
      },
    });
    dialogRef.subscribe((result) => {
      console.log(result);
    });
  }
}
