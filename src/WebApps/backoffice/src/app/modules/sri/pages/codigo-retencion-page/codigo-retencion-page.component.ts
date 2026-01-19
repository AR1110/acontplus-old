import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { CodigoRetencionAddEditDialogComponent } from '@modules/sri/pages/codigo-retencion-page/codigo-retencion-add-edit-dialog/codigo-retencion-add-edit-dialog.component';
import { CodigoRetencionService } from '@modules/sri/services/codigo-retencion.service';

import { CodigoRetencioRead } from '@modules/sri/models/codigo-retencion.model';

import { FormsModule } from '@angular/forms';

import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AdvancedDialogService, Pagination } from 'acontplus-ui-components';

@Component({
  selector: 'app-codigo-retencion-page',
  imports: [
    FormsModule,

    BreadcrumbComponent,

    MatSlideToggle,
    MatButton,
    MatCardContent,
    MatCard,
    MatIcon,
  ],
  templateUrl: './codigo-retencion-page.component.html',
  styles: ``,
})
export class CodigoRetencionPageComponent {
  private advancedDialogService = inject(AdvancedDialogService);
  private codigoRetencionSvc = inject(CodigoRetencionService);
  private tS = inject(ToastrNotificationService);
  pagination = new Pagination();

  codigosRetencion: CodigoRetencioRead[] = [];

  async openDialog(data?: CodigoRetencioRead) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: CodigoRetencionAddEditDialogComponent,
        title:
          data && data.idCodigoRetencion > 0
            ? 'Editar Código de Retención'
            : 'Nuevo Código de Retención',
        data: data && data.idCodigoRetencion > 0 ? structuredClone(data) : {},
      },
      {
        size: 'lg',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getAll();
      }
    });
  }

  getAll() {
    let params = {
      pageIndex: this.pagination.pageIndex,
      pageSize: this.pagination.pageSize,
    };
    this.codigoRetencionSvc.getAll(params).subscribe((response) => {
      console.log(response);
      this.codigosRetencion = response.codigosRetencion;
      if (this.codigosRetencion.length > 0) {
        this.pagination.totalRecords = this.codigosRetencion[0].totalRecords;
      }
    });
  }

  ngOnInit() {
    this.getAll();
  }

  pageChanged(): void {
    this.getAll();
  }

  changePageSize(): void {
    this.pagination.pageIndex = 1;
    this.getAll();
  }

  putStates(item: CodigoRetencioRead) {
    this.codigoRetencionSvc
      .putStatus(item.idCodigoRetencion, item.estado)
      .subscribe((response) => {
        if (response.code == '0') {
          this.tS.show({
            type: 'warning',
            message: response.message,
          });
        }
        if (response.code == '1') {
          this.tS.show({
            type: 'success',
            message: response.message,
          });
          this.getAll();
        }
      });
  }
}
