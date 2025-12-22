import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DynamicCard, Pagination } from '@acontplus/ng-components';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { DialogService } from '@core/services/dialog.service';
import { MassiveTaxDialogComponent } from '@inventory/ui/massive-tax-page/massive-tax-dialog/massive-tax-dialog.component';
import { finalize } from 'rxjs/operators';
import { MASSIVE_TAX_SERVICE } from '@inventory/data/inventory-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-massive-tax-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
    DynamicCard,
    MatDynamicTableComponent,
  ],
  templateUrl: './massive-tax-page.component.html',
})
export class MassiveTaxPageComponent implements OnInit {
  private readonly massiveTaxService = inject(MASSIVE_TAX_SERVICE);
  private _dialogSvc = inject(DialogService);

  dataSource = signal<unknown[]>([]);

  isLoadingResults = signal(false);

  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'index', label: '#', type: 'string' },
    { key: 'quantity', label: 'Cantidad Artículo', type: 'string' },
    { key: 'obs', label: 'Observación', type: 'string' },
    { key: 'createAt', label: 'Fecha Registro', type: 'string' },
    { key: 'user', label: 'Usuario', type: 'string' },
  ];

  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());

  refresh() {
    this.getAll();
  }

  openDialog() {
    const dialogRef = this._dialogSvc.open(MassiveTaxDialogComponent, {});
    dialogRef.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  getAll() {
    try {
      if (this.isLoadingResults()) return;

      this.isLoadingResults.set(true);
      this.massiveTaxService
        .getAll({})
        .pipe(finalize(() => this.isLoadingResults.set(false)))
        .subscribe((response) => {
          this.dataSource.set(response);
        });
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    this.getAll();
  }
}
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
