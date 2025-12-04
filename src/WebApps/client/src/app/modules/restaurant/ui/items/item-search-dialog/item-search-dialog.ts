import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-item-search-dialog',
  imports: [],
  templateUrl: './item-search-dialog.html',
  styleUrl: './item-search-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSearchDialog {
  data: any;


  close() {
  //  this.overlayRef.dispose();
  }
}
