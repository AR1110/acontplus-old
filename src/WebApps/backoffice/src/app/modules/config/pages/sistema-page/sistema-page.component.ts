import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort  } from '@angular/material/sort';
import {
  MatTableDataSource, MatTableModule,
} from '@angular/material/table';
import { Sistema } from '@modules/config/models/sistema';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { SistemaService } from '@modules/config/services/sistema.service';
import { SistemaAddEditComponent } from '@modules/config/pages/sistema-page/sistema-add-edit/sistema-add-edit.component';
import {  MatInputModule} from '@angular/material/input';
import {  MatCardModule} from '@angular/material/card';
import { AdvancedDialogService } from 'acontplus-ui-components';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-sistema-page',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIcon,
    MatButtonModule,
    BreadcrumbComponent,

  ],
  templateUrl: './sistema-page.component.html',
  styles: ``,
})
export class SistemaPageComponent implements OnInit {
  displayedColumns: string[] = [
    'op',
    'position',
    'code',
    'name',
    'domainUrl',
    'ipAddress',
  ];
  dataSource = new MatTableDataSource<Sistema>();
  private advancedDialogService = inject(AdvancedDialogService);
  private sistemaService = inject(SistemaService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: SistemaAddEditComponent,
        title: 'Nuevo Sistema',
      },
      {
        ariaLabelledBy: 'dialog-sistema',
        size: 'xl',
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

    this.sistemaService.getAll().subscribe({
      next(response) {
        const sistemas =
          response &&
          response.map((sistema: any, index: number) => ({
            ...sistema,
            position: index + 1,
          }));
        self.dataSource = new MatTableDataSource(sistemas);
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

  async dialogUpdate(data: Sistema) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: SistemaAddEditComponent,
        title: 'Editar Sistema',
        data: data,
      },
      {
        ariaLabelledBy: 'dialog-sistema',
        size: 'xl',
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
