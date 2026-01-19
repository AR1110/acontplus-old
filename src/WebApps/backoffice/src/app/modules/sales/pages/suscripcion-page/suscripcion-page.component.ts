import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuscripcionService } from '@modules/sales/services/suscripcion.service';
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { firstValueFrom, of } from 'rxjs';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ApiResponse } from 'acontplus-utils';
import { ToastrNotificationService } from 'acontplus-utils';

import { Suscripcion } from '@modules/sales/models/suscripcion';
import { SuscripcionDialogComponent } from '@modules/sales/pages/suscripcion-page/suscripcion-dialog/suscripcion-dialog.component';

import Swal from 'sweetalert2';

import { MatButton, MatIconButton } from '@angular/material/button';
import {MatFormField, MatInput} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AdvancedDialogService } from 'acontplus-ui-components';

@Component({
  selector: 'app-subscription-page',
  imports: [
    CommonModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    BreadcrumbComponent,

    MatButton,
    MatInput,
    MatTable,
    MatColumnDef,
    MatSort,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatIconButton,
    MatIcon,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatNoDataRow,
    MatPaginator,
    MatCardContent,
    MatCard,
    MatFormField,
  ],
  templateUrl: './suscripcion-page.component.html',
  styles: ``,
})
export class SuscripcionPageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private advancedDialogService = inject(AdvancedDialogService);
  private subscriptionService = inject(SuscripcionService);
  private tS = inject(ToastrNotificationService);

  colorToggle: ThemePalette = 'accent';
  colorPaid: ThemePalette = 'warn';
  displayedColumns: string[] = [
    'op',
    'position',
    'subscriptionTypeName',
    'companyName',
    'startDate',
    'endDate',
    'maxPaymentDate',
    'cost',
    'tax',
    'discount',
    'total',
    'paid',
    'isActive',
  ];
  dataSource = new MatTableDataSource<Suscripcion>();
  data: Suscripcion = {
    id: 0,
    companyId: 0,
    subscriptionTypeId: 0,
    startDate: new Date(),
    endDate: new Date(),
    maxPaymentDate: new Date(),
    warningMessage:
      'Su licencia esta próxima a caducar, comuniquese con el departamento de ventas de acontplus',
  };

  totalRows = 0;
  pageIndex = 0;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100];
  searching: boolean = false;

  applyFilter(event: any) {
    this.searching = true;
    const filterValue = event.target.value;
    if (filterValue && filterValue.length >= 3) {
      this.search(filterValue);
    }
    if (filterValue.length == 0) {
      this.get();
    }
  }

  askToDelete(element: any) {
    Swal.fire({
      html: `Esta seguro de eliminar esta suscripción de la empresa: <br> <b> ${element.companyName} </b>
      <br> <b>Licencia:</b> ${element.licenciaCode}
      <br> <b>Tipo:</b> ${element.subscriptionTypeName}`,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptionService.delete(element.id).subscribe({
          next: (response) => {
            if (response) {
              this.tS.show({
                type: response.code === '1' ? 'success' : 'warning',
                message: response.message,
              });
              if (response.code === '1') {
                this.get();
              }
            }
          },
        });
      }
    });
  }

  askToEnableDisable(event: MatSlideToggleChange, item: Suscripcion) {
    if (!event.checked) {
      Swal.fire({
        icon: 'warning',
        title: 'Alerta',
        text: 'Esta seguro de inactivar esta suscripción?, Los usuarios de la empresa, perderan acceso a los aplicativos',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Si',
      }).then((result) => {
        if (result.isConfirmed) {
          event.source.checked = event.checked;
          this.enableDisable(item.id, event.checked);
        } else {
          event.source.checked = !event.checked; // Reset the toggle state
        }
      });
    } else {
      this.enableDisable(item.id, event.checked);
    }
  }

  askToPay(event: MatSlideToggleChange, item: Suscripcion) {
    // console.log(item);
    if (event.checked) {
      Swal.fire({
        icon: 'warning',
        title: 'Alerta',
        text: 'Esta seguro de marcar esta suscripción como pagada?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Si',
      }).then((result) => {
        if (result.isConfirmed) {
          event.source.checked = event.checked;
          this.pay(item.id, event.checked);
        } else {
          event.source.checked = !event.checked; // Reset the toggle state
        }
      });
    } else {
      //this.pay(item.id, event.checked);
      this.tS.show({
        type: 'info',
        message:
          'La suscripciones pagadas, ya no se pueden marcar como no pagadas',
      });
      let checked = !event.checked;
      event.source.checked = checked;
      item.paid = checked;
    }
  }

  async edit(data: Suscripcion) {
    let suscripcion = await (await this.getById(data.id)).payload;

    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: SuscripcionDialogComponent,
        title: 'Editar Suscripción',
        data: JSON.parse(suscripcion as string),
      },
      {
        size: 'full',
      },
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response == 'object') {
        this.get();
      }
    });
  }

  enableDisable(id: number, estado: boolean) {
    this.subscriptionService.putStatus(id, estado).subscribe({
      next: (response) => {
        if (response) {
          this.tS.show({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
        }
      },
    });
  }

  get() {
    const obj = {
      pageIndex: this.currentPage + 1,
      pageSize: this.pageSize,
      tipo: 1,
    };
    this.subscriptionService.get(obj).subscribe({
      next: (response) => {
        const suscripciones =
          response &&
          response.suscripciones.map((suscripcion: any, index: number) => ({
            ...suscripcion,
            position: index + 1,
          }));
        this.dataSource = new MatTableDataSource(suscripciones);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length =
            suscripciones.length > 0 ? suscripciones[0].totalRecords : 0;
        });
      },
      error(error) {
        console.log(error);
      },
      complete() {},
    });
  }

  async getById(id: number): Promise<ApiResponse> {
    return firstValueFrom(this.subscriptionService.getById(id));
  }

  ngOnInit(): void {
    this.get();
  }

  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: SuscripcionDialogComponent,
        title: 'Nueva Suscripción',
      },
      {
        size: 'full',
      },
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response == 'object') {
        this.get();
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.get();
  }

  pay(id: number, paid: boolean) {
    this.subscriptionService.pay(id, paid).subscribe({
      next: (response) => {
        if (response) {
          this.tS.show({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
        }
      },
    });
  }

  search(textSearch: string) {
    const obj = {
      pageIndex: this.currentPage + 1,
      pageSize: this.pageSize,
      tipo: 3,
      textSearch,
    };
    this.subscriptionService.get(obj).subscribe({
      next: (response) => {
        const suscripciones =
          response &&
          response.suscripciones.map((suscripcion: any, index: number) => ({
            ...suscripcion,
            position: index + 1,
          }));
        this.dataSource = new MatTableDataSource(suscripciones);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length =
            suscripciones.length > 0 ? suscripciones[0].totalRecords : 0;
        });
      },
      error(error) {
        console.log(error);
      },
      complete() {},
    });
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      if (response.code === '0') {
        this.tS.show({
          type: 'warning',
          message: response.message!,
        });
      }
      if (response.code === '1') {
        this.tS.show({
          type: 'success',
          message: response.message!,
        });
        this.get();
      }
    }
  };
}
