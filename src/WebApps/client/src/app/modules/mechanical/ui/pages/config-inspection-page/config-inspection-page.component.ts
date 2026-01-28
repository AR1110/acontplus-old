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
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { NotificationService } from '@acontplus/ng-notifications';

import { VehicleList } from '@mechanical/domain/models/vehicle.model';
import { ConfigInspectionAddEditDirective } from '@mechanical/ui/directives/config-inspection-add-edit.directive';
import {
  Pagination,
  DynamicCard,
  DataGrid,
  Button,
  DataGridColumn,
} from '@acontplus/ng-components';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { VehicleUseCase } from '@mechanical/application/use-cases/vehicle.use-case';
import { finalize } from 'rxjs';
import { ListVehicleUseCase } from '@mechanical/application/use-cases/vehicle/list-vehicle.use-case';

@Component({
  selector: 'app-config-inspection-page',
  templateUrl: './config-inspection-page.component.html',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    MatIconModule,
    BreadcrumbComponent,
    ConfigInspectionAddEditDirective,
    DynamicCard,
    DataGrid,
    Button,
  ],
  styles: ``,
})
export class ConfigInspectionComponent implements OnInit, AfterViewInit {
  private vehicleUseCase = inject(VehicleUseCase);
  private $listUseCase = inject(ListVehicleUseCase);
  private tS = inject(NotificationService);

  dataSource = signal<VehicleList[]>([]);

  columns: DataGridColumn[] = [
    { header: '#', field: 'index', width: '60px', sortable: false },
    { header: 'Op.', field: 'op', sortable: false },
    { header: 'Descripción', field: 'description', sortable: true },
  ];

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
    // Templates se asignan automáticamente en acp-data-grid
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
            this.tS.warning({ message: response.message });
          }
          if (response.code === '1') {
            this.tS.success({ message: response.message });
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
        this.tS.success({ message: 'Actualizado correctamente' });
      } else {
        this.tS.warning({ message: 'Error en actualizar el estado' });
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
