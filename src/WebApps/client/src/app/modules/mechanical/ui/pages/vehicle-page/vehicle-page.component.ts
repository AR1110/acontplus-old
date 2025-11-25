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
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { VehicleList } from '@mechanical/domain/models/vehicle.model';
import { VehicleAddEditDirective } from '@mechanical/ui/directives/vehicle-add-edit.directive';
import { Pagination, DynamicCard } from '@acontplus/ng-components';
import Swal from 'sweetalert2';
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VehicleUseCase } from '@mechanical/application/use-cases/vehicle.use-case';
import { finalize } from 'rxjs';
import { ListVehicleUseCase } from '@mechanical/application/use-cases/vehicle/list-vehicle.use-case';

@Component({
  selector: 'app-vehicle-page',
  imports: [
    FormsModule,
    MatTableModule,

    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
    VehicleAddEditDirective,

    DynamicCard,
    MatDynamicTableComponent,
  ],
  templateUrl: './vehicle-page.component.html',
  styles: ``,
})
export class VehiclePageComponent implements OnInit, AfterViewInit {
  private vehicleUseCase = inject(VehicleUseCase);
  private $listUseCase = inject(ListVehicleUseCase);
  tS = inject(ToastrNotificationService);

  dataSource = signal<VehicleList[]>([]);

  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  columnsDefs: ColumnDefinition[] = [
    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'vehicleType', label: 'Tipo Vehiculo', type: 'string' },
    { key: 'licensePlate', label: 'Placa', type: 'string' },
    { key: 'idCard', label: 'Identificación', type: 'string' },
    { key: 'tradeName', label: 'Cliente/Conductor', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'template', templateOutlet: null },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);

  pagination = signal(new Pagination());

  isLoading = signal(false);

  resultModal(result?: any) {
    this.refresh();
  }

  refresh() {
    this.getVehicles();
  }

  private getVehicles() {
    try {
      const params = {
        pageIndex: this.pagination().pageIndex,
        pageSize: this.pagination().pageSize,
      };
      if (this.isLoading()) return;

      // showLoader();
      this.isLoading.set(true);
      this.$listUseCase
        .execute(params)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe((response) => {
          this.dataSource.set(response.data);
          this.pagination.update(
            (p) => new Pagination(p.pageIndex, p.pageSize, response.totalRecords),
          );
        });
    } catch (error) {
      // hideLoader();
    }
  }

  ngOnInit() {
    this.getVehicles();
  }

  ngAfterViewInit(): void {
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });
  }

  pageChanged(): void {
    this.getVehicles();
  }

  changePageSize(): void {
    this.pagination().pageIndex = 1;
    this.getVehicles();
  }

  //Remove or Delete
  askToDelete(id: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehicleUseCase.remove(id).subscribe((response) => {
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
            this.getVehicles();
          }
        });
      }
    });
  }

  //Status Vehicle
  putState(id: number, state: boolean) {
    this.vehicleUseCase.putState(id, state).subscribe((response) => {
      if (response) {
        this.tS.show({
          type: 'success',
          message: 'Actualizado correctamente',
        });
      } else {
        this.tS.show({
          type: 'warning',
          message: 'Error en actualizar el estado',
        });
      }
      this.getVehicles();
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
