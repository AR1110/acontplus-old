import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';

import {
  AdvancedDialogService,
  Button,
  DataGrid,
  DataGridColumn,
  DynamicCard,
  Pagination,
} from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GroupedEstab } from '@core/models/estab.model';
import { formatDateToString } from '@core/utils/date.util';
import { isValidField } from '@core/utils/utils';
import { SOLICITUD_AUTORIZACION_HTTP_TOKEN } from '@modules/config/data/config-token';
import { SolicitudAutorizacionList } from '@modules/config/data/models/solicitud-autorizacion.model';
import { UserRole } from '@modules/config/data/models/user/user-role.model';
import { SolicitudAutorizacionDetalle } from '@modules/config/ui/solicitud-autorizacion-page/solicitud-autorizacion-detalle/solicitud-autorizacion-detalle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-autorizacion-page',
  imports: [
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    Button,
    DynamicCard,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    DataGrid,
  ],
  templateUrl: './solicitud-autorizacion-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudAutorizacionPage implements OnInit {
  private readonly solicitudAutorizacionHttp = inject(SOLICITUD_AUTORIZACION_HTTP_TOKEN);
  private dialogSvc = inject(AdvancedDialogService);
  private readonly tS = inject(NotificationService);
  establecimientos: GroupedEstab[] = [];
  dataSource: SolicitudAutorizacionList[] = [];
  usersRole: UserRole[] = [];

  tiposDoc = [
    { code: '01', description: 'Factura' },
    { code: 'NE', description: 'Nota Entrega' },
    { code: '09', description: 'Proforma' },
  ];

  estadosDoc = [
    { code: 'P', description: 'Pendiente' },
    { code: 'A', description: 'Aprobada' },
    { code: 'R', description: 'Rechazada' },
    { code: 'F', description: 'Finalizada' },
  ];

  dataSearch = {
    codDoc: 0,
    codEstado: 0,
    usuarioSolicitanteId: 0,
    codEstab: '',
    fromDate: formatDateToString(new Date()),
    toDate: formatDateToString(new Date()),
  };

  columnsDefs: DataGridColumn[] = [
    { field: 'index', header: '#' },
    { field: 'op', header: 'Op.' },
    { field: 'nombreModulo', header: 'Tipo Doc.' },
    { field: 'serieComprobante', header: 'Serie Comprobante' },
    { field: 'nomAdminRoles', header: 'Usuarios Admin' },
    { field: 'usuarioSolicitante', header: 'Solicitado por:' },
    { field: 'usuarioAprobante', header: 'Autorizado por:' },
    { field: 'nombreAccion', header: 'Acción' },
    { field: 'obs', header: 'Motivo' },
    { field: 'fechaRegistro', header: 'Fecha Registro' },
    { field: 'fechaRespuesta', header: 'Fecha Respuesta' },
    { field: 'estado', header: 'Estado' },
  ];

  pagination = signal(new Pagination());

  loading = false;

  fetchDataFilter() {
    this.solicitudAutorizacionHttp.filter().subscribe((response) => {
      this.establecimientos = response.estabs;
      this.usersRole = response.usersRole;

      const dataEstab = this.establecimientos.find((e) => e.defaultEstab);
      if (dataEstab) {
        this.dataSearch.codEstab = dataEstab.codEstab;
        this.fetchAllData();
      }
    });
  }
  fetchAllData() {
    const params = {
      pageIndex: this.pagination().pageIndex + 1,
      pageSize: this.pagination().pageSize,
      checkBoxFecha: true,
      codEstab: this.dataSearch.codEstab,
      dateFrom: this.dataSearch.fromDate,
      dateTo: this.dataSearch.toDate,
      usuarioSolicitanteId: isValidField(this.dataSearch.usuarioSolicitanteId),
      codDoc: isValidField(this.dataSearch.codDoc),
      codEstado: isValidField(this.dataSearch.codEstado),
    };

    this.dataSource = [];
    this.solicitudAutorizacionHttp.list(params).subscribe((response) => {
      this.dataSource = response.data;

      this.pagination.update((e) => new Pagination(e.pageIndex, e.pageSize, response.totalRecords));
    });
  }
  refresh() {
    this.fetchAllData();
  }
  ngOnInit() {
    this.fetchDataFilter();
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.fetchAllData();
  }

  askToApprobe(data: SolicitudAutorizacionList) {
    try {
      void Swal.fire({
        title: 'Aprobar Solicitud de Autorización',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aprobar!',
        cancelButtonText: 'Cancelar!',
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            const params = {
              tipo: 1,
              idSolicitudAutorizacion: data.idSolicitudAutorizacion,
              rowguid: data.rowguid,
            };
            this.solicitudAutorizacionHttp.update(params).subscribe((response) => {
              if (response.code === '1') {
                this.tS.success({ message: response.message });
                this.fetchAllData();
              } else {
                this.tS.warning({ message: response.message });
              }
            });
          } catch (error) {
            console.error(error);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  rechazar(data: SolicitudAutorizacionList) {
    try {
      void Swal.fire({
        title: 'Rechazar Solicitud de Autorización',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Rechazar!',
        cancelButtonText: 'Cancelar!',
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            const params = {
              tipo: 3,
              idSolicitudAutorizacion: data.idSolicitudAutorizacion,
              rowguid: data.rowguid,
            };
            this.solicitudAutorizacionHttp.update(params).subscribe((response) => {
              if (response.code === '1') {
                this.tS.success({ message: response.message });
                this.fetchAllData();
              } else {
                this.tS.warning({ message: response.message });
              }
            });
          } catch (error) {
            console.error(error);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async openDetalle(data: SolicitudAutorizacionList) {
    await this.dialogSvc.openInWrapper(
      {
        component: SolicitudAutorizacionDetalle,
        title: 'Detalle de Modificación',
        icon: 'list',
        showCloseButton: true,
        data,
      },
      {
        size: 'md',
      },
    );
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      const updated = new Pagination(pag.pageIndex, pag.pageSize, pag.totalRecords);
      updated.handlePageEvent(e);
      return updated;
    });
    this.refresh();
  }
}
