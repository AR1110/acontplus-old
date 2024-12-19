import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VehicleRead } from '@mechanical/domain/models/vehicle.model';
import { VehicleService } from '@mechanical/data/vehicle/vehicle.service';
import { VehicleAddEditDirective } from '@mechanical/ui/directives/vehicle-add-edit.directive';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '@shared/models/pagination.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-vehicle-page',
    imports: [
        FormsModule,
        MatTableModule,
        FontAwesomeModule,
        MatSlideToggleModule,
        BreadcrumbComponent,
        VehicleAddEditDirective,
        NgbPagination
    ],
    templateUrl: './vehicle-page.component.html',
    styles: ``
})
export class VehiclePageComponent {
  vehicleSvc = inject(VehicleService);
  tS = inject(ToasterService);

  visibleColumns = ['position', 'op', 'tipoVehiculo', 'placa', 'identificacion', 'cliente-conductor', 'estado'];

  pagination = new Pagination();
  dataSource: VehicleRead[] = [];

  resultModal(result?: any) {
    this.getVehicles()
  }


  getVehicles() {
    try {
      let params = {
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
      }
      // showLoader();
      this.vehicleSvc.getAll(params).subscribe({
        next: (response) => {
          // hideLoader()
          this.dataSource = response;

          if (this.dataSource.length > 0) {
            this.pagination.totalRecords = this.dataSource[0].totalRecords;
          }

        },
        error(err) {
          // hideLoader()
          console.log(err)
        },
      })
    } catch (error) {
      // hideLoader();
    }
  }


  ngOnInit() {
    this.getVehicles();
  }

  pageChanged(): void {
    this.getVehicles();
  }

  changePageSize(): void {
    this.pagination.pageIndex = 1;
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
        this.vehicleSvc.remove(id).subscribe({
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
    this.vehicleSvc.putState(id, state).subscribe({
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
}
