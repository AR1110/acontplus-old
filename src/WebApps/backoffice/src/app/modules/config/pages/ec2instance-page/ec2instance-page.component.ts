import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort  } from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { Ec2Instance } from '@modules/config/models/ec2instance.model';
import { Ec2instanceDialogComponent } from './ec2instance-dialog/ec2instance-dialog.component';
import { ThemePalette } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { Ec2instanceService } from '@modules/config/services/ec2instance.service';
import {  MatInputModule} from '@angular/material/input';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-ec2instance-page',
    imports: [
        ReactiveFormsModule,
        FormsModule,
      MatCardModule,
      MatTableModule,
      MatFormFieldModule,
      MatInputModule,
        MatSlideToggleModule,
        BreadcrumbComponent,
      MatIcon,
      MatButtonModule,
      MatPaginatorModule

    ],
  templateUrl: './ec2instance-page.component.html',
})
export class Ec2instancePageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly _dialog = inject(MatDialog);
  private readonly _ec2InstanceService = inject(Ec2instanceService);
  private readonly _tS = inject(ToastrNotificationService);

  displayedColumns: string[] = [
    'op',
    'position',
    'instanceId',
    'instanceName',
    'instanceType',
    'ipAddress',
    'region',
    'isActive',
  ];
  dataSource = new MatTableDataSource<Ec2Instance>();

  colorToggle: ThemePalette = 'accent';

  fetch: any[] = [];

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';

    const dialogRef = this._dialog.open(
      Ec2instanceDialogComponent,
      dialogConfig,
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response === 'object') {
        this.getAll();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as any).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAll() {
    const self = this;

    this._ec2InstanceService.getAll().subscribe({
      next(response) {
        const licenses =
          response &&
          response.map((license: any, index: number) => ({
            ...license,
            position: index + 1,
          }));
        self.dataSource = new MatTableDataSource(licenses);
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

  dialogUpdate(data: Ec2Instance) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = data;

    const dialogRef = this._dialog.open(
      Ec2instanceDialogComponent,
      dialogConfig,
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response === 'object') {
        this.getAll();
      }
    });
  }

  startStop(data: Ec2Instance) {
    let url: string | undefined;
    url = data.isActive ? data.urlStart : data.urlStop || '';

    if (!url)
      return this._tS.show({ type: 'warning', message: 'Url no valida!' });

    this.fetch.push(
      this._ec2InstanceService.startStop(url).subscribe((response) => {
        console.log(response);
      }),
    );
    this.fetch.push(
      this._ec2InstanceService.put(data.id, data).subscribe((response) => {
        this._tS.show({
          type: 'info',
          message: 'Estado actualizado exitosamente!',
        });
      }),
    );
    this.fetch.push(this.getAll());

    Promise.all(this.fetch)
      .then((data) => {
        this.getAll();
      })
      .catch((error: any) => {
        if (error.message) {
          console.log(error.message);
        } else {
          console.log(error);
        }
      });
  }
}
