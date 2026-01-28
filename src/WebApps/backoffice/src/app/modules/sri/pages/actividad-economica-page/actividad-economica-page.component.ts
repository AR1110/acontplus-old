import { Component, inject, signal } from '@angular/core';
import { ActividadEconomicaService } from '@modules/sri/services/actividad-economica.service';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatButton } from '@angular/material/button';
import { ActividadEconomicaAddEditDialogComponent } from '@modules/sri/pages/actividad-economica-page/actividad-economica-add-edit-dialog/actividad-economica-add-edit-dialog.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  AdvancedDialogService,
  Pagination,
  StatusDisplayPipe,
} from 'acontplus-ui-components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-actividad-economica-page',
  imports: [
    MatButton,

    BreadcrumbComponent,

    FormsModule,
    StatusDisplayPipe,
    MatInput,
    MatCardContent,
    MatCard,
    MatIcon,
  ],
  templateUrl: './actividad-economica-page.component.html',
  styles: ``,
})
export class ActividadEconomicaPageComponent {
  private readonly _aeService = inject(ActividadEconomicaService);
  private readonly advancedDialogService = inject(AdvancedDialogService);
  private readonly _tS = inject(ToastrNotificationService);

  activities: any[] = [];
  data: any = {};
  pagination = signal(new Pagination());
  searching: boolean = false;

  applyFilter($event: any) {
    this.searching = true;
    const filterValue = $event.target.value;
    if (filterValue && filterValue.length >= 3) {
      this.search(filterValue);
    }
    if (filterValue.length == 0) {
      this.loadData();
    }
  }

  loadData() {
    this._aeService
      .get({
        pageIndex: this.pagination().pageIndex,
        pageSize: this.pagination().pageSize,
        tipo: 1,
      })
      .subscribe((response) => {
        this.activities = response.activities;
        this.pagination().totalRecords = this.activities[0]?.totalRecords ?? 0;
      });
  }

  ngOnInit() {
    this.loadData();
  }

  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: ActividadEconomicaAddEditDialogComponent,
        title:
          this.data.idActividadEconomica > 0
            ? 'Editar Actividad Económica'
            : 'Nueva Actividad Económica',
        data: this.data.idActividadEconomica > 0 ? this.data : {},
      },
      {
        size: 'lg',
      },
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response === 'object' && response.code === '1') {
        this.loadData();
      }
      this.data = {};
    });
  }

  async onEdit(item: any) {
    this.data = item;
    await this.openDialog();
  }

  search(textSearch: string) {
    const obj = {
      pageIndex: this.pagination().pageIndex,
      pageSize: this.pagination().pageSize,
      tipo: 3,
      textSearch,
    };
    this._aeService.get(obj).subscribe((response) => {
      this.activities = response.activities;
      this.pagination().totalRecords = this.activities[0]?.totalRecords ?? 0;
    });
  }
}
