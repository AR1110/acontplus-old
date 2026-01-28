import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { PorcentajeRetIvaAddEditDialogComponent } from '@modules/sri/pages/porcentaje-ret-iva-page/porcentaje-ret-iva-add-edit-dialog/porcentaje-ret-iva-add-edit-dialog.component';
import { PorcentajeRetIvaService } from '@modules/sri/services/porcentaje-ret-iva.service';
import { FormsModule } from '@angular/forms';
import { PorcentajeRetIvaRead } from '@modules/sri/models/porcentaje-ret-iva.model';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AdvancedDialogService, Pagination } from 'acontplus-ui-components';

@Component({
  selector: 'app-porcentaje-ret-iva-page',
  imports: [
    BreadcrumbComponent,
    FormsModule,

    MatSlideToggle,
    MatButton,
    MatCardContent,
    MatCard,
    MatIcon,
  ],
  templateUrl: './porcentaje-ret-iva-page.component.html',
  styles: ``,
})
export class PorcentajeRetIvaPageComponent {
  private advancedDialogService = inject(AdvancedDialogService);
  private porcentajeRetIvaSvc = inject(PorcentajeRetIvaService);
  private tS = inject(ToastrNotificationService);

  pagination = new Pagination();

  porcentajesRetIva: PorcentajeRetIvaRead[] = [];

  async openDialog(data?: any) {
    let dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: PorcentajeRetIvaAddEditDialogComponent,
        title:
          data.idPorcentajeRetIva > 0
            ? 'Editar Porcentaje Retención Iva'
            : 'Nuevo Porcentaje Retención Iva',
        data: data.idPorcentajeRetIva > 0 ? structuredClone(data) : {},
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
    this.porcentajeRetIvaSvc.getAll(params).subscribe((response) => {
      console.log(response);
      this.porcentajesRetIva = response.porcentajesRetIva;
      if (this.porcentajesRetIva.length > 0) {
        this.pagination.totalRecords = this.porcentajesRetIva[0].totalRecords;
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

  putStates(item: PorcentajeRetIvaRead) {
    this.porcentajeRetIvaSvc
      .putStatus(item.idPorcentajeRetIva, item.estado)
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
