import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import {
  UserCustomer,
  UserCustomerRoleRead,
} from '@modules/config/models/user-customer.model';
import { UserCustomerDialogComponent } from './user-customer-dialog/user-customer-dialog.component';
import { UserCustomerPasswordDialogComponent } from './user-customer-password-dialog/user-customer-password-dialog.component';
import { UserCustomerService } from '@modules/config/services/user-customer.service';
import { UserCustomerRoleService } from '@modules/config/services/user-customer-role.service';

import { UserCustomerRoleDialogComponent } from '@modules/config/pages/user-customer-page/components/user-customer-role-dialog/user-customer-role-dialog.component';
import { ThemePalette } from '@angular/material/core';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatIconModule } from '@angular/material/icon';

import {MatFormField, MatInput} from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AdvancedDialogService, Pagination } from 'acontplus-ui-components';

@Component({
  selector: 'app-user-customer-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSlideToggle,
    ReactiveFormsModule,
    FormsModule,
    BreadcrumbComponent,
    MatSort,
    MatInput,
    MatButton,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatCardContent,
    MatCard,
    MatFormField,
  ],
  templateUrl: './user-customer-page.component.html',
  styleUrl: './user-customer-page.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class UserCustomerPageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private dialog = inject(MatDialog);
  private advancedDialogService = inject(AdvancedDialogService);
  private tS = inject(ToastrNotificationService);
  private userCustomerSvc = inject(UserCustomerService);
  private userCustomerRoleSvc = inject(UserCustomerRoleService);
  expandedElement: any;
  displayedColumns: string[] = [
    'op',
    'position',
    'idCard',
    'fullname',
    'username',
    'email',
    'estado',
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  dataSource = new MatTableDataSource<UserCustomer>([]);

  //user customer roles
  displayedColumnsUserCustomerRoles: string[] = [
    'op',
    'position',
    'businessName',
    'role',
    'estado',
  ];
  dataSourceUserCustomerRoles = new MatTableDataSource<UserCustomerRoleRead>(
    [],
  );

  // ------------Pagination--------
  pagination = new Pagination();
  totalRows = 0;
  pageIndex = 0;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100];

  searching: boolean = false;

  colorToggle: ThemePalette = 'accent';

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAll();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';

    const dialogRef = this.dialog.open(
      UserCustomerDialogComponent,
      dialogConfig,
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response === 'object') {
        this.getAll();
      }
    });
  }

  applyFilter(event: any) {
    this.searching = true;
    const filterValue = event.target.value;

    if (filterValue && filterValue.length >= 3) {
      this.search(filterValue);
    }

    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
    if (filterValue.length == 0) {
      this.getAll();
    }
  }

  getAll() {
    const obj = {
      pageIndex: this.currentPage + 1,
      pageSize: this.pageSize,
    };
    this.userCustomerSvc.getAll(obj).subscribe((response) => {
      const userCustomers: Array<UserCustomer> =
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
    });
  }

  search(textSearch: string) {
    const obj = {
      pageIndex: this.currentPage + 1,
      pageSize: this.pageSize,
      textSearch,
    };
    this.userCustomerSvc.search(obj).subscribe((response) => {
      const userCustomers: Array<UserCustomer> =
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
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAll();
  }

  dialogUpdate(data: UserCustomer) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.width = '40%';
    dialogConfig.data = data;

    const dialogRef = this.dialog.open(
      UserCustomerDialogComponent,
      dialogConfig,
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (typeof response === 'object') {
        this.getAll();
      }
    });
  }

  async openDialogAsigRole(data: UserCustomer) {
    try {
      const dialogRef = await this.advancedDialogService.openInWrapper(
        {
          component: UserCustomerRoleDialogComponent,
          title: 'Asignar Rol',
          data: {
            userCustomerId: data.id,
          },
        },
        {
          size: 'xl',
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  onExpanded($event: any, element: UserCustomer) {
    this.dataSourceUserCustomerRoles =
      new MatTableDataSource<UserCustomerRoleRead>();
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      $event.stopPropagation();
      this.getUserCustomerRole(element.id);
    }
  }

  getUserCustomerRole(userCustomerId: number) {
    try {
      let params = { userCustomerId, pageIndex: 1, pageSize: 25, tipo: 1 };
      this.userCustomerRoleSvc.get(params).subscribe((response) => {
        if (response) {
          if (response.code == '1') {
            let { userCustomerRoles } = JSON.parse(response.payload as string);

            const tempUserCustomerRoles: Array<UserCustomerRoleRead> =
              userCustomerRoles &&
              userCustomerRoles.map((userCustomerRole: any, index: number) => ({
                ...userCustomerRole,
                position: index + 1,
              }));
            this.dataSourceUserCustomerRoles = new MatTableDataSource(
              tempUserCustomerRoles,
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async dialogUserCustomerRoleUpdate(element: UserCustomerRoleRead) {
    try {
      this.expandedElement = null;
      const dialogRef = await this.advancedDialogService.openInWrapper(
        {
          component: UserCustomerRoleDialogComponent,
          title: 'Editar Rol',
          data: element,
        },
        { size: 'xl' },
      );
    } catch (error) {
      console.log(error);
    }
  }

  onDeleteUserCustomerRole(element: UserCustomerRoleRead) {
    const self = this;
    Swal.fire({
      text: 'Esta seguro de eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!',
    }).then((result) => {
      if (result.value) {
        this.userCustomerRoleSvc.delete(element.id).subscribe({
          next(response) {
            if (response) {
              if (response.code === '0') {
                Swal.fire({
                  icon: 'warning',
                  text: response.message,
                });
              }
              if (response.code === '1') {
                Swal.fire({
                  icon: 'success',
                  text: response.message,
                  timer: 1000,
                });
                self.getAll();
              }
            }
          },
        });
      }
    });
  }

  async openDialogPassword(user: UserCustomer) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: UserCustomerPasswordDialogComponent,
        title: 'Cambiar Contraseña',
        data: user,
      },
      { size: 'sm' },
    );
  }

  enableUser(id: number, estado: boolean) {
    this.userCustomerSvc.putStatus(id, estado).subscribe({
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

  enableRole(id: number, estado: boolean) {
    this.userCustomerRoleSvc.putStatus(id, estado).subscribe({
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

  onToggleChange(event: MatSlideToggleChange, item: UserCustomer) {
    if (!event.checked) {
      Swal.fire({
        icon: 'warning',
        title: 'Alerta',
        text: 'Esta seguro de inactivar este usuario?, Se desahibilitaran todos los roles',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Si',
      }).then((result) => {
        if (result.isConfirmed) {
          event.source.checked = event.checked;
          this.enableUser(item.id, event.checked);
        } else {
          event.source.checked = !event.checked; // Reset the toggle state
        }
      });
    } else {
      this.enableUser(item.id, event.checked);
    }
  }

  onToggleChangeRole(event: MatSlideToggleChange, item: UserCustomer) {
    if (!event.checked) {
      Swal.fire({
        icon: 'warning',
        title: 'Alerta',
        text: 'Esta seguro de inactivar este rol del usuario?',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Si',
      }).then((result) => {
        if (result.isConfirmed) {
          event.source.checked = event.checked;
          this.enableRole(item.id, event.checked);
        } else {
          event.source.checked = !event.checked; // Reset the toggle state
        }
      });
    } else {
      this.enableRole(item.id, event.checked);
    }
  }
}
