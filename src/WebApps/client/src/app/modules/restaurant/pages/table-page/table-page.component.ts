import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { hideLoader, showLoader } from '@core/utils/loader';
import { Floor } from '@modules/restaurant/models/floor.model';
import { Room } from '@modules/restaurant/models/room.model';
import { Table } from '@modules/restaurant/models/table.model';
import { TableService } from '@modules/restaurant/services/table.service';
import { NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EstabAsignacionService } from '@shared/services/estab-asignacion.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import Swal from 'sweetalert2';
import { FloorService } from '@modules/restaurant/services/floor.service';

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    NgbNavModule,
    BreadcrumbComponent,
    NgbAccordionModule,
  ],
  styles: `
    .custom-header::after {
      content: none;
    }
  `,
})
export class TablePageComponent {
  establecimientos: Array<EstablecimientoSelectHtmlOnly> = [];
  dataSearch = {
    codEstab: '',
  };
  floors: Array<Floor> = [];
  rooms: Array<Room> = [];
  tables: Array<Table> = [];
  active = 1;
  private tableSvc = inject(TableService);
  private estabAsignSvc = inject(EstabAsignacionService);
  private modalSvc = inject(ModalService);
  private floorSvc = inject(FloorService);

  ngOnInit() {
    showLoader();
    this.estabAsignSvc.getAll().subscribe({
      next: (response) => {
        hideLoader();
        this.establecimientos = response;
        const dataEstab = this.establecimientos.find(
          (item) => item.predeterminado,
        );
        if (dataEstab) {
          this.dataSearch.codEstab = dataEstab.codEstab;
          this.getDataTables();
        }
      },
      error(error) {
        hideLoader();
        console.log(error);
      },
    });
  }

  onChangeEstab() {
    this.getDataTables();
  }

  askToDeleteFloor(id: number) {
    try {
      Swal.fire({
        // title: "Are you sure?",
        text: 'Esta seguro de eliminar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí!',
        cancelButtonText: 'No!',
      }).then((result) => {
        if (result.isConfirmed) {
          showLoader();
          this.floorSvc.remove(id).subscribe({
            next: (response) => {
              hideLoader();
              this.getDataTables();
            },
            error: (error) => {
              hideLoader();
              console.log(error);
            },
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  private getDataTables() {
    this.tableSvc.getAll(this.dataSearch.codEstab).subscribe({
      next: (response) => {
        console.log(response);
        const { floors, rooms, tables } = response;
        this.floors = floors; //PISOS
        this.rooms = rooms;
        this.tables = tables;
        // this.establecimientos = response;
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
