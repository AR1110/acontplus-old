import { Component, inject, OnInit, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RetencionAtsList } from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { RetencionAtsUseCase } from '@billing/domain/use-cases/retencion-ats.use-case';
import { DialogService } from '@core/services/dialog.service';
import { RetencionAtsAddEditComponent } from './components/retencion-ats-add-edit/retencion-ats-add-edit.component';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

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
    MatTooltip,
    FaIconComponent,
  ],
  templateUrl: './retencion-ats.component.html',
  styles: ``,
})
export class RetencionAtsComponent implements OnInit {
  retenciones = signal<RetencionAtsList[]>([]);
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'estado', label: 'Estado', type: 'string' },
    { key: 'fechaEmision', label: 'Fecha Emisión', type: 'string' },
    { key: 'serieComprobante', label: 'Serie', type: 'string' },
    { key: 'rucReceptor', label: 'Ruc Receptor', type: 'string' },
    { key: 'razonSocial', label: 'Razón Social ', type: 'string' },
    { key: 'claveAcceso', label: 'No. Aut.', type: 'string' },
    { key: 'fechaAutorizacion', label: 'F. Aut.', type: 'string' },
    { key: 'usuario', label: 'Usuario', type: 'string' },
    { key: 'importeTotal', label: 'Total Retenido', type: 'number' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  faWhatsapp: IconProp = faWhatsapp;

  private readonly _dialogService = inject(DialogService);
  private readonly _retencionAtsUseCase = inject(RetencionAtsUseCase);

  pagination = signal(new MatPagination());

  loadData() {
    this.pagination().pageIndex = 1;
    this._retencionAtsUseCase
      .getAll(this.pagination())
      .subscribe((response) => {
        if (response.retenciones.length > 0) {
          this.retenciones.set(response.retenciones);
          this.pagination().totalRecords =
            response.retenciones[0]!.totalRecords || 0;
        }
      });
  }

  ngOnInit() {
    this.loadData();
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
    this.pagination().pageIndex = $event.pageIndex + 1;
    this.pagination().pageSize = $event.pageSize;
    this.loadData();
  }

  downloadXml(item: any) {}

  getRide(item: any) {}

  cancel(item: any) {}

  authorize(item: any) {}

  sendEmail(item: any) {}

  sendWhatsApp(item: any) {}

  edit(item: RetencionAtsList) {
    this._retencionAtsUseCase
      .getById(item.idRetencionAts)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
