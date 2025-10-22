import {Injectable, HostListener, inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchResult } from './universal-search/universal-search.component';
import {
  UniversalSearchDialog
} from "@inventory/product/presentation/components/universal-search-dialog/universal-search-dialog.component";
import {DialogService} from "@core/services/dialog.service";

@Injectable({ providedIn: 'root' })
export class SearchDialogService {
  private dgSvc = inject(DialogService)
  private items: SearchResult[] = [];

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

  setItems(items: SearchResult[]) {
    this.items = items;
  }

  open(displayMode?: 'list' | 'card' | 'table') {
    // avoid opening multiple dialogs
    if (document.querySelector('.search-dialog-panel')) return;

    const ref = this.dgSvc.open(UniversalSearchDialog, {
      size: 'xl',
      disableClose: false,
      data: { items: this.items, displayMode }
    });

    return ref;
  }
}
