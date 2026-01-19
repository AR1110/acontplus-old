import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CompanyDialogComponent } from '@modules/config/pages/company-page/components/company-dialog/company-dialog.component';
import { Company } from '@modules/config/models/company.model';
import { CompanyService } from '@modules/config/services/company.service';

import { ScheduleConfigDialogComponent } from '@modules/seguridad/components/schedule-config-dialog/schedule-config-dialog.component';
import Swal from 'sweetalert2';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

import { ThemePalette } from '@angular/material/core';
import { ToastrNotificationService } from 'acontplus-utils';

import { ConfigWhatsappDialogComponent } from '@modules/config/pages/company-page/components/config-whatsapp-dialog/config-whatsapp-dialog.component';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AdvancedDialogService } from 'acontplus-ui-components';

@Component({
  selector: 'app-company-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTableModule,

    BreadcrumbComponent,
    MatInput,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatSort,
    MatIcon,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './company-page.component.html',
  styles: `
    .button-container {
      padding-bottom: 16px;
    }

    .demo-button {
      & + & {
        margin-left: 8px;
      }
    }
  `,
})
export class CompanyPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private dialog = inject(MatDialog);
  private companyService = inject(CompanyService);
  private advancedDialogService = inject(AdvancedDialogService);
  private tS = inject(ToastrNotificationService);

  colorToggle: ThemePalette = 'accent';

  displayedColumns: string[] = [
    'op',
    'position',
    'idCard',
    'businessName',
    'tradeName',
    'email',
    'address',
    'isActive',
  ];
  dataSource = new MatTableDataSource<Company>();

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

  askToEnableDisable(event: MatSlideToggleChange, item: any) {
    if (!event.checked) {
      Swal.fire({
        icon: 'warning',
        title: 'Alerta',
        text: 'Esta seguro de inactivar esta empresa?. Se deshabilitaran las suscripciones y usuarios activos',
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

  enableDisable(id: number, estado: boolean) {
    this.companyService.putStatus(id, estado).subscribe({
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

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(CompanyDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response === 'object') {
        this.get();
      }
    });
  }

  get() {
    const obj = {
      pageIndex: this.currentPage + 1,
      pageSize: this.pageSize,
      tipo: 1,
    };
    this.companyService.get(obj).subscribe({
      next: (response) => {
        if (response && response.code === '1') {
          let { companies } = JSON.parse(response.payload as string);
          companies =
            response &&
            companies.map((company: any, index: number) => ({
              ...company,
              position: index + 1,
            }));
          this.dataSource = new MatTableDataSource(companies);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
    });
  }

  ngOnInit(): void {
    this.get();
  }

  dialogUpdate(data: Company) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = data;

    const dialogRef = this.dialog.open(CompanyDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response === 'object') {
        this.get();
      }
    });
  }

  ngOnDestroy(): void {
    console.log('unmounted..........................');
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.get();
  }

  search(textSearch: string) {
    const obj = {
      pageIndex: this.currentPage + 1,
      pageSize: this.pageSize,
      textSearch,
      tipo: 3, //main list
    };
    this.companyService.search(obj).subscribe({
      next: (response) => {
        const userCustomers: Array<Company> =
          response &&
          (response.map((userCustomer: any, index: number) => ({
            ...userCustomer,
            position: index + 1,
          })) as []);
        this.dataSource.data = userCustomers;

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length =
            userCustomers.length > 0 ? userCustomers[0].totalRecords : 0;
        });
      },
    });
  }

  // For scheduleConfig
  async scheduleConfig(data: Company) {
    let dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: ScheduleConfigDialogComponent,
        title:
          data.id > 0
            ? 'Editar Configuración de Horario'
            : 'Nueva Configuración de Horario',
        data: data,
      },
      {
        size: 'lg',
      },
    );
  }

  async openDialogWhatsAppConfig(data: Company) {
    let dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: ConfigWhatsappDialogComponent,
        title:
          data.id > 0
            ? 'Editar Configuración de WhatsApp'
            : 'Nueva Configuración de WhatsApp',
        data: { companyId: data.id },
      },
      {
        size: 'lg',
      },
    );
  }
}
