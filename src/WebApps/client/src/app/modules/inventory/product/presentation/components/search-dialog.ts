import {Injectable, inject} from '@angular/core';
import {
  ProductSearchDialog,
} from "@inventory/product/presentation/components/product-search-dialog/product-search-dialog";
import {DialogService} from "@core/services/dialog.service";

@Injectable({ providedIn: 'root' })
export class SearchDialogService {
  private dgSvc = inject(DialogService)

  constructor( ) {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      // Ctrl+K (or Cmd+K on mac)
      const isK = event.key.toLowerCase() === 'k';
      const isMod = event.ctrlKey || event.metaKey;
      if (isMod && isK) {
        event.preventDefault();
        this.open();
      }
    });
  }

  open() {
    // avoid opening multiple dialogs
    if (document.querySelector('.dialog-shell')) return;

    const ref = this.dgSvc.open(ProductSearchDialog, {
      size: 'xl',
      disableClose: false,
      data: {  }
    });

    return ref;
  }
}
