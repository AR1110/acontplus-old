import {Component, inject } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';
import {
  ProductSearchDataGrid
} from "@inventory/product/presentation/components/product-search-data-grid/product-search-data-grid";

@Component({
  selector: 'app-product-search-dialog.ts',
  templateUrl: './product-search-dialog.html',
  styleUrls: ['./product-search-dialog.scss'],
  standalone: true,
  imports: [
    ProductSearchDataGrid
  ]
})
export class ProductSearchDialog {

  public dialogRef = inject(MatDialogRef<ProductSearchDialog>);


  onClose() {
    this.dialogRef.close();
  }
}
