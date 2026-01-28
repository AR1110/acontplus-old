import { NotificationService } from '@acontplus/ng-notifications';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

import { Button, DataGrid, DataGridColumn, DynamicCard } from '@acontplus/ng-components';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { CreateAsignacionBodegaUseCase } from '@modules/config/application/use-cases/asignacion-bodega/create-asignacion-bodega.use-case';
import { ListAsignacionBodegaUseCase } from '@modules/config/application/use-cases/asignacion-bodega/list-asignacion-bodega.use-case';
import { UpdateAsignacionBodegaUseCase } from '@modules/config/application/use-cases/asignacion-bodega/update-asignacion-bodega.use-case';
import { CreateAsignacionPuntoEmisionUseCase } from '@modules/config/application/use-cases/asignacion-punto-emision/create-asignacion-punto-emision.use-case';
import { ListAsignacionPuntoEmisionUseCase } from '@modules/config/application/use-cases/asignacion-punto-emision/list-asignacion-punto-emision.use-case';
import { UpdateAsignacionPuntoEmisionUseCase } from '@modules/config/application/use-cases/asignacion-punto-emision/update-asignacion-punto-emision.use-case';
import { AsignacionBodegaList } from '@modules/config/data/models/user/asignacion-bodega.model';
import { AsignacionEstabList } from '@modules/config/data/models/user/asignacion-estab.model';
import { AsignacionPuntoEmisionList } from '@modules/config/data/models/user/asignacion-punto-emision.model';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-bodega-punto-emision-modal',
  imports: [
    MatSlideToggleModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    DynamicCard,
    DataGrid,
    Button,
  ],
  templateUrl: './asignacion-bodega-punto-emision-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsignacionBodegaPuntoEmisionDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<AsignacionBodegaPuntoEmisionDialog>);
  params = inject<{ data: AsignacionEstabList }>(MAT_DIALOG_DATA);

  private $listAsignacionPuntoEmisionUseCase = inject(ListAsignacionPuntoEmisionUseCase);
  private $listAsignacionBodegaUseCase = inject(ListAsignacionBodegaUseCase);
  private $createAsignacionPuntoEmisionUseCase = inject(CreateAsignacionPuntoEmisionUseCase);

  private $createAsignacionBodegaUseCase = inject(CreateAsignacionBodegaUseCase);
  private $updateAsignacionBodegaUseCase = inject(UpdateAsignacionBodegaUseCase);
  private $updateAsignacionPuntoEmisionUseCase = inject(UpdateAsignacionPuntoEmisionUseCase);

  private tS = inject(NotificationService);

  dataSourcePuntoEmision = signal<AsignacionPuntoEmisionList[]>([]);
  dataSourceBodega = signal<AsignacionBodegaList[]>([]);

  columnsDefsPuntoEmision: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'ptoEmi', header: 'Nro. Emisión' },
    { field: 'nomEstado', header: 'Estado' },
    { field: 'defaultPtoEmi', header: 'Predeterminado' },
  ];

  columnsDefsBodega: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'descripcion', header: 'Descripción' },
    { field: 'nomEstado', header: 'Estado' },
    { field: 'defaultBodga', header: 'Predeterminado' },
  ];

  private get getParamsData() {
    return this.params.data;
  }

  fetchAllData() {
    forkJoin([
      this.$listAsignacionPuntoEmisionUseCase.execute({
        codEstab_Asig: this.getParamsData.codEstab_Asig,
      }),
      this.$listAsignacionBodegaUseCase.execute({
        codEstab_Asig: this.getParamsData.codEstab_Asig,
      }),
    ]).subscribe((response) => {
      const [puntosEmision, bodegas] = response;
      this.dataSourcePuntoEmision.set(puntosEmision.data);
      this.dataSourceBodega.set(bodegas.data);
    });
  }

  private successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this.tS.warning({
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.tS.success({
        message: response.message,
      });
      this.fetchAllData();
    }
  };

  ngOnInit() {
    this.fetchAllData();
  }

  onChangePuntoEmisionDefault(item: AsignacionPuntoEmisionList) {
    this.$updateAsignacionPuntoEmisionUseCase.execute(item).subscribe(this.successResponse);
  }

  async addPuntoEmision(item: AsignacionPuntoEmisionList) {
    try {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger m-2',
        },
        buttonsStyling: false,
      });

      const { isConfirmed } = await swalWithBootstrapButtons.fire({
        icon: 'warning',
        html: `<small>Está seguro de ${item.idPtoEmi_Asig > 0 ? 'quitar' : 'asignar'} este Punto de Emisión: <b>${item.ptoEmi}</b> a Sucursal: <b>${this.getParamsData.nombreComercial}</b></small>`,
        showCancelButton: true,
        confirmButtonText: `Sí, ${item.idPtoEmi_Asig > 0 ? 'quitar' : 'asignar'}`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: false,
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        const params = {
          ...item,
          codEstab_Asig: this.getParamsData.codEstab_Asig,
        };
        this.$createAsignacionPuntoEmisionUseCase.execute(params).subscribe(this.successResponse);
      }
    } catch (error) {
      // Handle error silently
    }
  }

  onChangeBodegaDefault(item: AsignacionBodegaList) {
    this.$updateAsignacionBodegaUseCase.execute(item).subscribe(this.successResponse);
  }

  async addBodega(item: AsignacionBodegaList) {
    try {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger m-2',
        },
        buttonsStyling: false,
      });

      const { isConfirmed } = await swalWithBootstrapButtons.fire({
        icon: 'warning',
        html: `<small>Está seguro de ${item.idBodeg_Asig > 0 ? 'quitar' : 'asignar'} este Bodega: <b>${item.descripcion}</b> a Establecimiento: <b>${this.getParamsData.nombreComercial}</b></small>`,
        showCancelButton: true,
        confirmButtonText: `Sí, ${item.idBodeg_Asig > 0 ? 'quitar' : 'asignar'}`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: false,
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        const params = {
          ...item,
          codEstab_Asig: this.getParamsData.codEstab_Asig,
        };
        this.$createAsignacionBodegaUseCase.execute(params).subscribe(this.successResponse);
      }
    } catch (error) {
      // Handle error silently
    }
  }

  close() {
    this.dialogRef.close();
  }
}
