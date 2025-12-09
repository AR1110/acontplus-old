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
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DateRangeSelectionComponent } from '@core/components/date-range-selection/date-range-selection.component';

import { GroupedEstab } from '@core/models/estab.model';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { formatDateToString } from '@core/utils/date.util';

import { isValidField } from '@core/utils/utils';
import { UserCustomerRole } from '@modules/config/domain/models/user-customer/user-customer-role.model';
import { Pagination } from '@acontplus/ng-components';
import Swal from 'sweetalert2';
import { SolicitudUsuarioUseCase } from '@modules/config/application/use-cases/solicitud-usuario.use-case';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { DynamicCard } from '@acontplus/ng-components';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ListSolicitudAutorizacionUseCase } from '@modules/config/application/use-cases/solicitud-autorizacion/list-solicitud-autorizacion.use-case';
import { FilterSolicitudAutorizacionUseCase } from '@modules/config/application/use-cases/solicitud-autorizacion/filter-solicitud-autorizacion.use-case';
import { SolicitudAutorizacionList } from '@modules/config/domain/models/solicitud-autorizacion.model';
import { DialogService } from '@core/services/dialog.service';
import { SolicitudAutorizacionDetalleComponent } from '@modules/config/ui/solicitud-autorizacion/solicitud-autorizacion-detalle/solicitud-autorizacion-detalle.component';
import { UpdateSolicitudAutorizacionUseCase } from '@modules/config/application/use-cases/solicitud-autorizacion/update-solicitud-autorizacion.use-case';

@Component({
  selector: 'app-solicitud-autorizacion',
  imports: [
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    DynamicCard,
    BreadcrumbComponent,
    DateRangeSelectionComponent,
    MatDynamicTableComponent,
  ],
  templateUrl: './solicitud-autorizacion.component.html',
})
export class SolicitudAutorizacionComponent implements OnInit, AfterViewInit {
  private readonly $solicitudUsuarioUseCase = inject(SolicitudUsuarioUseCase);
  private readonly $filterUseCase = inject(FilterSolicitudAutorizacionUseCase);
  private readonly $listUseCase = inject(ListSolicitudAutorizacionUseCase);
  private readonly $updateUseCase = inject(UpdateSolicitudAutorizacionUseCase);
  private _dialogSvc = inject(DialogService);
  private readonly tS = inject(ToastrNotificationService);
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  establecimientos: GroupedEstab[] = [];
  dataSource: SolicitudAutorizacionList[] = [];
  usersRole: UserCustomerRole[] = [];

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

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'nombreModulo', label: 'Tipo Doc.', type: 'string' },
    { key: 'serieComprobante', label: 'Serie Comprobante', type: 'string' },
    { key: 'nomAdminRoles', label: 'Usuarios Admin', type: 'string' },
    { key: 'usuarioSolicitante', label: 'Solicitado por:', type: 'string' },
    { key: 'usuarioAprobante', label: 'Autorizado por:', type: 'string' },
    { key: 'nombreAccion', label: 'Acción', type: 'string' },
    { key: 'obs', label: 'Motivo', type: 'string' },
    { key: 'fechaRegistro', label: 'Fecha Registro', type: 'string' },
    { key: 'fechaRespuesta', label: 'Fecha Respuesta', type: 'string' },
    { key: 'estado', label: 'Estado', type: 'template' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());

  loading = false;

  fetchDataFilter() {
    this.$filterUseCase.execute().subscribe((response) => {
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
    this.$listUseCase.execute(params).subscribe((response) => {
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

  ngAfterViewInit(): void {
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });
  }

  onDateRangeSelection(range: { from: string; to: string }) {
    this.dataSearch.fromDate = range.from;
    this.dataSearch.toDate = range.to;
    this.fetchAllData();
  }

  askToApprobe(data: SolicitudAutorizacionList) {
    try {
      Swal.fire({
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
            this.$updateUseCase.execute(params).subscribe((response) => {
              const icon = response.code === '1' ? 'success' : 'warning';
              Swal.fire({
                icon: icon as any,
                html: response.message,
              });
              if (response.code === '1') {
                this.fetchAllData();
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  rechazar(data: SolicitudAutorizacionList) {
    try {
      Swal.fire({
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
            this.$updateUseCase.execute(params).subscribe((response) => {
              const icon = response.code === '1' ? 'success' : 'warning';
              Swal.fire({
                icon: icon as any,
                html: response.message,
              });
              if (response.code === '1') {
                this.fetchAllData();
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  openDetalle(data: SolicitudAutorizacionList) {
    this._dialogSvc.open(SolicitudAutorizacionDetalleComponent, {
      size: 'md',
      data,
    });
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
