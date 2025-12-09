import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { AsignacionBodegaList } from '@modules/config/domain/models/user-customer/asignacion-bodega.model';
import { AsignacionPuntoEmisionList } from '@modules/config/domain/models/user-customer/asignacion-punto-emision.model';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { DynamicCard } from '@acontplus/ng-components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ListAsignacionPuntoEmisionUseCase } from '@modules/config/application/use-cases/asignacion-punto-emision/list-asignacion-punto-emision.use-case';
import { ListAsignacionBodegaUseCase } from '@modules/config/application/use-cases/asignacion-bodega/list-asignacion-bodega.use-case';
import { AsignacionEstabList } from '@modules/config/domain/models/user-customer/asignacion-estab.model';
import { CreateAsignacionPuntoEmisionUseCase } from '@modules/config/application/use-cases/asignacion-punto-emision/create-asignacion-punto-emision.use-case';
import { CreateAsignacionBodegaUseCase } from '@modules/config/application/use-cases/asignacion-bodega/create-asignacion-bodega.use-case';
import { UpdateAsignacionBodegaUseCase } from '@modules/config/application/use-cases/asignacion-bodega/update-asignacion-bodega.use-case';
import { UpdateAsignacionPuntoEmisionUseCase } from '@modules/config/application/use-cases/asignacion-punto-emision/update-asignacion-punto-emision.use-case';

@Component({
  selector: 'app-user-bodega-punto-emision-modal',
  imports: [
    MatSlideToggleModule,

    FormsModule,
    MatCustomDialogComponent,
    DynamicCard,
    MatDynamicTableComponent,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './asignacion-bodega-punto-emision-dialog.component.html',
})
export class AsignacionBodegaPuntoEmisionDialogComponent implements OnInit, AfterViewInit {
  private dialogRef = inject(MatDialogRef<AsignacionBodegaPuntoEmisionDialogComponent>);
  params = inject<AsignacionEstabList>(MAT_DIALOG_DATA);

  private $listAsignacionPuntoEmisionUseCase = inject(ListAsignacionPuntoEmisionUseCase);
  private $listAsignacionBodegaUseCase = inject(ListAsignacionBodegaUseCase);
  private $createAsignacionPuntoEmisionUseCase = inject(CreateAsignacionPuntoEmisionUseCase);

  private $createAsignacionBodegaUseCase = inject(CreateAsignacionBodegaUseCase);
  private $updateAsignacionBodegaUseCase = inject(UpdateAsignacionBodegaUseCase);
  private $updateAsignacionPuntoEmisionUseCase = inject(UpdateAsignacionPuntoEmisionUseCase);

  private tS = inject(ToastrNotificationService);

  @ViewChild('templatePuntoEmisionDefault') templatePuntoEmisionDefault!: TemplateRef<any>;
  @ViewChild('templateDefaultBodega') templateDefaultBodega!: TemplateRef<any>;

  dataSourcePuntoEmision = signal<AsignacionPuntoEmisionList[]>([]);
  dataSourceBodega = signal<AsignacionBodegaList[]>([]);

  columnsDefsPuntoEmision: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'ptoEmi', label: 'Nro. Emisión', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
    { key: 'defaultPtoEmi', label: 'Predeterminado', type: 'template' },
  ];
  columnsPuntoEmision: string[] = this.columnsDefsPuntoEmision.map((colDef) => colDef.key);

  columnsDefsBodega: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
    { key: 'defaultBodga', label: 'Predeterminado', type: 'template' },
  ];
  columnsBodega: string[] = this.columnsDefsBodega.map((colDef) => colDef.key);

  fetchAllData() {
    forkJoin([
      this.$listAsignacionPuntoEmisionUseCase.execute({ codEstab_Asig: this.params.codEstab_Asig }),
      this.$listAsignacionBodegaUseCase.execute({ codEstab_Asig: this.params.codEstab_Asig }),
    ]).subscribe((response) => {
      const [puntosEmision, bodegas] = response;
      this.dataSourcePuntoEmision.set(puntosEmision.data);
      this.dataSourceBodega.set(bodegas.data);
    });
  }

  private successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this.tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.tS.show({
        type: 'success',
        message: response.message,
      });
      this.fetchAllData();
    }
  };

  ngOnInit() {
    this.fetchAllData();
  }

  ngAfterViewInit(): void {
    this.columnsDefsPuntoEmision.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.templatePuntoEmisionDefault;
      }
    });
    this.columnsDefsBodega.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.templateDefaultBodega;
      }
    });
  }

  onChangePuntoEmisionDefault(item: AsignacionPuntoEmisionList) {
    try {
      this.$updateAsignacionPuntoEmisionUseCase.execute(item).subscribe(this.successResponse);
    } catch (error) {
      console.log(error);
    }
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
        html: `<small>Está seguro de ${item.idPtoEmi_Asig > 0 ? 'quitar' : 'asignar'} este Punto de Emisión: <b>${item.ptoEmi}</b> a Sucursal: <b>${this.params.nombreComercial}</b></small>`,
        showCancelButton: true,
        confirmButtonText: `Sí, ${item.idPtoEmi_Asig > 0 ? 'quitar' : 'asignar'}`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: false,
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        const params = {
          ...item,
          codEstab_Asig: this.params.codEstab_Asig,
        };
        this.$createAsignacionPuntoEmisionUseCase.execute(params).subscribe(this.successResponse);
      }
    } catch (error) {}
  }

  //Bodegas
  onChangeBodegaDefault(item: AsignacionBodegaList) {
    try {
      this.$updateAsignacionBodegaUseCase.execute(item).subscribe(this.successResponse);
    } catch (error) {
      console.log(error);
    }
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
        html: `<small>Está seguro de ${item.idBodeg_Asig > 0 ? 'quitar' : 'asignar'} este Bodega: <b>${item.descripcion}</b> a Establecimiento: <b>${this.params.nombreComercial}</b></small>`,
        showCancelButton: true,
        confirmButtonText: `Sí, ${item.idBodeg_Asig > 0 ? 'quitar' : 'asignar'}`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: false,
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        const params = {
          ...item,
          codEstab_Asig: this.params.codEstab_Asig,
        };
        this.$createAsignacionBodegaUseCase.execute(params).subscribe(this.successResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
