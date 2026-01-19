import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { ReportAddEditDialogComponent } from '@modules/config/pages/report-page/components/report-add-edit-dialog/report-add-edit-dialog.component';
import { ReportService } from '@modules/config/services/report.service';

import { ReportReadDto } from '@modules/config/models/report.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from 'acontplus-utils';

import {MatButton, MatIconButton} from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  AdvancedDialogService, Pagination,
  StatusDisplayPipe,
} from 'acontplus-ui-components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-report-page',
  imports: [
    FormsModule,
    BreadcrumbComponent,
    StatusDisplayPipe,
    MatButton,
    MatCardContent,
    MatCard,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './report-page.component.html',
  styles: ``,
})
export class ReportPageComponent {
  private advancedDialogService = inject(AdvancedDialogService);
  private reportSvc = inject(ReportService);
  private tS = inject(ToastrNotificationService);

  pagination = new Pagination();

  reports: ReportReadDto[] = [];

  async openDialog(data ={} as any) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: ReportAddEditDialogComponent,
        title: data.idReporte > 0 ? 'Editar Reporte' : 'Nuevo Reporte',
        data: data.idReporte > 0 ? data : {},
      },
      {
        size: 'lg',
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null && typeof result === 'object') {
        this.getReports();
      }
    });
  }

  refresh(){
    this.getReports();
  }

  getReports() {
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
    };
    this.reportSvc.getAll(params).subscribe((response) => {
      this.reports = response;
    });
  }

  ngOnInit() {
    this.getReports();
  }

  askToDelete(item: ReportReadDto) {
    Swal.fire({
      title: 'Eliminar',
      text:
        '¿Está seguro de eliminar los parametros del reporte: ' +
        item.reportPath +
        '?',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí!',
      showDenyButton: true,
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportSvc.delete(item.idReporte).subscribe((response) => {
          if (response) {
            if (response.code === '0') {
              this.tS.show({
                type: 'warning',
                message: response.message,
              });
            }

            if (response.code === '1') {
              this.tS.show({
                type: 'success',
                message: response.message,
              });
              this.getReports();
            }
          }
        });
      }
    });
  }
}
