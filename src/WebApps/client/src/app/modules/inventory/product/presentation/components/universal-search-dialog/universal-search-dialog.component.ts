import {Component, inject, Inject, signal} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {SearchResult, UniversalSearch} from '../universal-search/universal-search.component';
import {ProductUseCase} from "@inventory/product/application/use-cases/product.use-case";

@Component({
  selector: 'app-universal-search-dialog.ts',
  templateUrl: './universal-search-dialog.component.html',
  styleUrls: ['./universal-search-dialog.component.scss'],
  standalone: true,
  imports: [
    UniversalSearch
  ]
})
export class UniversalSearchDialog {
  private readonly productUseCase = inject(ProductUseCase);
  filteredResults: SearchResult[] = [];

  configSearch = signal({
    search: this.productUseCase.search,
    displayMode: 'table' as 'list' | 'card' | 'table'
  })

  constructor(
    public dialogRef: MatDialogRef<UniversalSearchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { items: SearchResult[], displayMode?: 'list' | 'card' | 'table' }
  ) {}


  onClose() {
    this.dialogRef.close();
  }
}
