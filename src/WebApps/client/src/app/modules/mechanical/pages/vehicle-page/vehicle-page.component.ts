import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VehicleRead } from '@modules/mechanical/models/vehicle.model';
import { VehicleService } from '@modules/mechanical/services/vehicle.service';
import { VehicleAddEditDirective } from '@modules/mechanical/shared/directives/vehicle-add-edit.directive';
import { Pagination } from '@shared/class/pagination';
import { ActionAddDirective } from '@shared/directives/permission/action-add.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-page',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    VehicleAddEditDirective,
    ActionAddDirective
  ],
  templateUrl: './vehicle-page.component.html',
  styles: ``
})
export class VehiclePageComponent {
  vehicleSvc = inject(VehicleService);
  tS = inject(ToasterService);

  displayedColumns = ['position', 'op', 'tipoVehiculo', 'placa','identificacion', 'cliente-conductor', 'estado'];

  pagination = new Pagination();
  dataSource: VehicleRead[] = [];

  resultModal(result?:any){
    this.getVehicles()
  }


  getVehicles(){
    try {
      let params = {
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
      }
      this.vehicleSvc.getAll(params).subscribe({
        next: (response) =>{
          this.dataSource = response;

        },
      })
    } catch (error) {
      hideLoader();
    }
  }


  ngOnInit(){
    this.getVehicles();
  }

  //Remove or Delete
  askToDelete(id:number) {
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
          next: (response)=> {
              if(isApiResponse(response)){
                if(response.code==="0"){
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
}
