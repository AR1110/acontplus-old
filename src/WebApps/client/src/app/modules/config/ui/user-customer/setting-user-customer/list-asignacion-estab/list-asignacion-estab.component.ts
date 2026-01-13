import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ListAsignacionEstabUseCase } from '@modules/config/application/use-cases/asignacion-estab/list-asignacion-estab.use-case';
import { UserCustomerStore } from '@modules/config/application/store/user-customer.store';
import {
  Pagination,
  DataGrid,
  DataGridColumn,
  AdvancedDialogService,
  Button,
} from '@acontplus/ng-components';
import { AsignacionEstabList } from '@modules/config/data/models/user-customer/asignacion-estab.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { UpdateAsignacionEstabUseCase } from '@modules/config/application/use-cases/asignacion-estab/update-asignacion-estab.use-case';
import { NotificationService } from '@acontplus/ng-notifications';
import Swal from 'sweetalert2';
import { CreateAsignacionEstabUseCase } from '@modules/config/application/use-cases/asignacion-estab/create-asignacion-estab.use-case';
import { AsignacionBodegaPuntoEmisionDialog } from '@modules/config/ui/user-customer/setting-user-customer/asignacion-bodega-punto-emision-dialog/asignacion-bodega-punto-emision-dialog';

@Component({
  selector: 'app-list-asignacion-estab',
  imports: [MatSlideToggleModule, FormsModule, DataGrid, Button],
  templateUrl: './list-asignacion-estab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAsignacionEstabComponent implements OnInit {
  private $listAsignacionEstabUseCase = inject(ListAsignacionEstabUseCase);
  private $updateAsignacionEstabUseCase = inject(UpdateAsignacionEstabUseCase);
  private $createAsignacionEstabUseCase = inject(CreateAsignacionEstabUseCase);
  private $userCustomerStore = inject(UserCustomerStore);
  private tS = inject(NotificationService);
  private dialogSvc = inject(AdvancedDialogService);

  $loading = signal(false);

  dataSource = signal<AsignacionEstabList[]>([]);

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'estab', header: 'Nro. Estab' },
    { field: 'nombreComercial', header: 'Nombre Comercial' },
    { field: 'predeterminado', header: 'Predeterminado' },
  ];

  pagination = signal(new Pagination());

  private getList() {
    this.$listAsignacionEstabUseCase
      .execute({
        userRoleId: this.$userCustomerStore.userRoleId(),
      })
      .subscribe((response) => {
        this.dataSource.set(response.data);
      });
  }

  ngOnInit() {
    this.getList();
  }

  onChangeDefault(data: AsignacionEstabList) {
    this.$updateAsignacionEstabUseCase.execute(data).subscribe((response) => {
      if (response.code === '0') {
        this.tS.warning({
          message: response.message,
        });
      }
      if (response.code === '1') {
        this.tS.success({
          message: response.message,
        });
        this.getList();
      }
    });
  }

  async addEstab(data: AsignacionEstabList) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger m-2',
      },
      buttonsStyling: false,
    });

    const { isConfirmed } = await swalWithBootstrapButtons.fire({
      html: `<small>Está seguro de ${data.idEstab_Asig > 0 ? 'quitar' : 'asignar'} este Establecimiento: <b>${data.nombreComercial}</b></small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${data.idEstab_Asig > 0 ? 'quitar' : 'asignar'}`,
      cancelButtonText: 'No, cancelar!',
      reverseButtons: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (isConfirmed) {
      const params = {
        id: data.idEstab_Asig,
        idUsuarioRol: this.$userCustomerStore.userRoleId(),
        codEstab: data.codEstab,
      };
      this.$createAsignacionEstabUseCase.execute(params).subscribe((response) => {
        if (response.code === '0') {
          this.tS.warning({
            message: response.message,
          });
        }
        if (response.code === '1') {
          this.tS.success({
            message: response.message,
          });
          this.getList();
        }
      });
    }
  }

  async openAsigBodegaPtoEmision(item: AsignacionEstabList) {
    await this.dialogSvc.openInWrapper(
      {
        component: AsignacionBodegaPuntoEmisionDialog,
        title: 'Asignación de Punto de Emisión y Bodega',
        icon: 'settings',
        showCloseButton: true,
        data: item,
      },
      {
        size: 'lg',
      },
    );
  }
}
