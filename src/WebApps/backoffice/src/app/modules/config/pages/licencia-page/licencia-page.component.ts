import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { Licencia } from '@modules/config/models/licencia';
import { LicenciaService } from '@modules/config/services/licencia.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { LicenciaDialogComponent } from './licencia-dialog/licencia-dialog.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AdvancedDialogService } from 'acontplus-ui-components';

@Component({
  selector: 'app-licencia-page',
  imports: [
    CommonModule,
    MatSortModule,
    ReactiveFormsModule,
    FormsModule,

    BreadcrumbComponent,
    MatButton,
    MatInput,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatColumnDef,
    MatIconButton,
    MatCell,
    MatIcon,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatNoDataRow,
    MatPaginator,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './licencia-page.component.html',
  styles: ``,
})
export class LicenciaPageComponent implements OnInit {
  displayedColumns: string[] = [
    'op',
    'code',
    'licenseType',
    'total',
    'tax',
    'discount',
  ];
  dataSource = new MatTableDataSource<Licencia>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private advancedDialogService: AdvancedDialogService,
    private licenseService: LicenciaService,
  ) {}

  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: LicenciaDialogComponent,
        title: 'Nueva Licencia',
      },
      {
        ariaLabelledBy: 'dialog-sistema',
        size: 'lg',
      },
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response == 'object') {
        this.getAll();
      }
    });
  }

  applyFilter(event: any) {
    const filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAll() {
    const self = this;

    this.licenseService.getAll().subscribe({
      next(response) {
        self.dataSource = new MatTableDataSource(response.licencias);
        self.dataSource.paginator = self.paginator;
        self.dataSource.sort = self.sort;
      },
      complete() {},
      error() {},
    });
  }

  ngOnInit(): void {
    this.getAll();
  }

  async dialogUpdate(data: Licencia) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: LicenciaDialogComponent,
        title: 'Editar Licencia',
        data: data,
      },
      {
        ariaLabelledBy: 'dialog-sistema',
        size: 'lg',
      },
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response == 'object') {
        this.getAll();
      }
    });
  }

  ngOnDestroy(): void {
    console.log('unmounted..........................');
  }
}
