import {Component, input, output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {CustomMatSpinnerComponent} from "@/shared/components/custom-mat-spinner/custom-mat-spinner.component";
import {Pagination} from "@/shared/models/pagination.model";

@Component({
    selector: 'app-custom-table-container',
    imports: [
        DatePipe,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        MatPaginator,
        MatProgressSpinner,
        MatRow,
        MatRowDef,
        MatSort,
        MatSortHeader,
        MatTable,
        CustomMatSpinnerComponent
    ],
    template: `<div class="custom-main-container">
  <app-custom-mat-spinner
    [isLoadingResults]="isLoadingResults()"
    [isRateLimitReached]="isRateLimitReached()"
  />

 <div class="custom-table-container mt-2" [style.height]="valueHeight()">
   <ng-content></ng-content>
 </div>


 @if(pagination() ){
   <mat-paginator #paginator
                  (page)="handlePageEvent($event)"
                  [length]="pagination()?.totalRecords"
                  [pageSize]="pagination()?.pageSize"
                  [pageSizeOptions]="pagination()?.pageSizeOptions??[]"
                  [showFirstLastButtons]="true"
                  [pageIndex]="pagination()?.pageIndex"
                  aria-label="Select page">
   </mat-paginator>
 }

</div>
`,
    styles: `
  .custom-main-container {
    position: relative;
    display: flex;
  flex-direction: column;
  //height: 100vh; /* Ocupa el 100% de la altura del viewport */
  }

  .custom-table-container {
    position: relative;
  flex-grow: 1; /* Se expande para llenar el espacio disponible */
  min-height: 200px; /* Altura mínima que quieres asegurar */
  max-height: 400px; /* Altura mínima que quieres asegurar */
 // height: calc(77dvh - 200px); /* Altura dinámica según el tamaño de la pantalla */
  overflow: auto; /* Añade scroll si el contenido supera el contenedor */
  }

  table {
    width: 100%;
  }
  `
})
export class CustomTableContainerComponent {

  isLoadingResults = input<boolean>(false)
  isRateLimitReached = input<boolean>(false)
  pagination = input<Pagination>()
  valueHeight = input<string>() ;

  onPageEvent=output<PageEvent>()

  handlePageEvent(e: PageEvent) {
     this.onPageEvent.emit(e)
  }
}
