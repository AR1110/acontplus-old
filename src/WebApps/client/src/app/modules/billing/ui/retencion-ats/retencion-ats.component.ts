import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RetencionAtsList } from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats.use-case';
import { DialogService } from '@core/services/dialog.service';
import { RetencionAtsAddEditComponent } from './components/retencion-ats-add-edit/retencion-ats-add-edit.component';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-retencion-ats',
    imports: [
        BreadcrumbComponent,
        MatCard,
        MatCardContent,
        MatMenuTrigger,
        MatIconButton,
        MatIcon,
        MatMenuItem,
        MatMenu,
        MatDynamicTableComponent,
        MatPaginator,
        ThemeButtonComponent,
    ],
  templateUrl: './retencion-ats.component.html',
  styles: ``,
})
export class RetencionAtsComponent {
  retenciones: RetencionAtsList[] = [];
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'fechaEmision', label: 'Subcategoría', type: 'string' },
    { key: 'subcategoryName', label: 'Fecha Emisión', type: 'string' },
    { key: 'serieComprobante', label: 'Serie', type: 'string' },
    { key: 'importeTotal', label: 'Total', type: 'number' },
    { key: 'rucEmisor', label: 'Ruc Emisor', type: 'string' },
    { key: 'razonSocialEmisor', label: 'Razón Social Emisor', type: 'string' },
    { key: 'claveAcceso', label: 'No. Aut.', type: 'string' },
    { key: 'fechaAutorizacion', label: 'F. Aut.', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  private readonly _dialogService = inject(DialogService);
  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);

  pagination = signal(new MatPagination());

  loadData() {
    this._retencionAtsUseCase
      .getAll(this.pagination())
      .subscribe((response) => {
        this.retenciones = response.retenciones;
        this.pagination().totalRecords = response.retenciones[0].totalRecords;
      });
  }

  onDialogOpen() {
    const dialogRef = this._dialogService.open(RetencionAtsAddEditComponent, {
      size: 'xxl',
    });

    dialogRef.subscribe((response) => {
      console.log(response);
    });
  }

  onPageChanged($event: PageEvent) {
    this.pagination().pageIndex = $event.pageIndex;
    this.pagination().pageSize = $event.pageSize;
    this.loadData();
  }

  downloadXml(item: any) {}

  getRide(item: any) {}
}
