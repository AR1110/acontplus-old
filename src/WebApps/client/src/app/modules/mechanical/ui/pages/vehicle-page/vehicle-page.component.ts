import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VehicleRead } from '@mechanical/domain/models/vehicle.model';
import { VehicleAddEditDirective } from '@mechanical/ui/directives/vehicle-add-edit.directive';
import { MatPagination } from '@shared/models/pagination.model';
import Swal from 'sweetalert2';
import { MatDynamicCardComponent } from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import { MatDynamicTableComponent } from '@shared/components/mat-dynamic-table/mat-dynamic-table.component';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VehicleUseCase } from '@modules/mechanical/domain/use-cases/vehicle.use-case';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vehicle-page',
  imports: [
    FormsModule,
    MatTableModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
    VehicleAddEditDirective,

    MatDynamicCardComponent,
    MatDynamicTableComponent
  ],
  templateUrl: './vehicle-page.component.html',
  styles: ``
})
export class VehiclePageComponent {
  private vehicleUseCase = inject(VehicleUseCase)
  tS = inject(ToasterService);

  dataSource: VehicleRead[] = [];

  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  columnsDefs: ColumnDefinition[] = [

    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'vehicleType', label: 'Tipo Vehiculo', type: 'string' },
    { key: 'licensePlate', label: 'Placa', type: 'string' },
    { key: 'idCard', label: 'Identificación', type: 'string' },
    { key: 'tradeName', label: 'Cliente/Conductor', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'template', templateOutlet: null },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  pagination = signal(new MatPagination());

  isLoading = false

  resultModal(result?: any) {
    this.refresh()
  }


  refresh() {
    this.getVehicles()
  }


  private getVehicles() {
    try {
      let params = {
        pageIndex: this.pagination().pageIndex,
        pageSize: this.pagination().pageSize,
      }
      if(this.isLoading) return;

      // showLoader();
      this.isLoading = true;
      this.vehicleUseCase.getAll(params)
      .pipe(
        finalize(()=>this.isLoading=false)
      )
      .subscribe( (response) => {
          this.dataSource = response;

          if (this.dataSource.length > 0) {
            this.pagination().totalRecords = this.dataSource[0].totalRecords;
          }

        }  )
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
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        showLoader();
        this.vehicleUseCase.remove(id).subscribe({
          next: (response) => {
            if (isApiResponse(response)) {
              if (response.code === "0") {
                this.tS.toastr({
                  type: 'warning',
                  message: response.message
                })
              }
              if (response.code === "1") {
                this.tS.toastr({
                  type: 'success',
                  message: response.message
                })
                this.getVehicles();
              }
            }
          },
          error(err) {
            console.log(err)
            hideLoader();
          },
        })
      }
    });
  };


  //Status Vehicle
  putState(id: number, state: boolean) {
    showLoader();
    this.vehicleUseCase.putState(id, state).subscribe({
      next: (response) => {
        hideLoader();
        if (response) {
          this.tS.toastr({
            type: 'success',
            message: 'Actualizado correctamente'
          })

        }
        else {
          this.tS.toastr({
            type: 'warning',
            message: 'Error en actualizar el estado'
          })
        }
        this.getVehicles()
      },
    })
  };


  handlePageEvent(e: PageEvent) {
    this.pagination.update((pag) => {
      return {
        ...pag,
        totalRecords: e.length,
        pageSize: e.pageSize,
        pageIndex: e.pageIndex,
      };
    });
     this.refresh();
  }

}
