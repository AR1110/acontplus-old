import {Component, inject} from '@angular/core';
import {OrderDocListComponent} from "@ui/orders/components/order-doc-list/order-doc-list.component";
import {MAT_BOTTOM_SHEET_DATA} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-bottom-sheet-docs',
  imports: [
    OrderDocListComponent
  ],
  templateUrl: './bottom-sheet-docs.component.html',
  styleUrl: './bottom-sheet-docs.component.scss'
})
export class BottomSheetDocsComponent {
   params = inject<{id: number}>(MAT_BOTTOM_SHEET_DATA)
}
