import {Component, inject, signal, TemplateRef, ViewChild} from '@angular/core';
import { Floor } from '@restaurant/domain/models/floor.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@core/services/modal.service';
import { FloorAddEditModalComponent } from '@restaurant/infrastructure/floor/floor-add-edit-modal/floor-add-edit-modal.component';
 ;
import { SharedService } from '@core/services/shared.service';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import {MatButton, MatButtonModule} from '@angular/material/button';
import { NgClass } from '@angular/common';

import swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import {FloorUseCase} from "@restaurant/domain/use-cases/floor.use-case";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatPagination} from "@shared/models/pagination.model";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'app-floor-list',
    imports: [
        FaIconComponent,
        MatButton,
        NgClass,
      MatFormFieldModule, MatInputModule, MatSelectModule,
      MatIconModule,
      MatButtonModule,
      FormsModule,
      MatDynamicTableComponent
    ],
    templateUrl: './floor-list.component.html',
    styles: ``
})
export class FloorListComponent {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  establecimientoId: number = 0;
  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  floors: Floor[] = [];

  private _floorUseCase = inject(FloorUseCase);
  #modalService = inject(ModalService);
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);

  isLoadingResults = false;

  columnsDefs: ColumnDefinition[] = [

    { key: 'index', label: 'Nro.', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'code', label: 'Código', type: 'string' },
    { key: 'description', label: 'Descripción', type: 'string' },
    { key: 'capacity', label: 'Capacidad', type: 'string' },
    { key: 'estado', label: 'Estado', type: 'template' },

  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  pagination = signal(new MatPagination());


  refresh(){
    this.loadData()
  }

  loadData( ) {
    // if (!this.panelOpenState()) {
    //   return;
    // }
    this.isLoadingResults = true;
    this._floorUseCase.getByEstab(this.establecimientoId)
      .pipe(
        finalize(()=>this.isLoadingResults=false)
      )
      .subscribe(res=>{
      this.floors = res;
    })

  }

  getEstabs() {
    this.#sharedService.getEstabAsign().subscribe((response) => {
      this.establecimientos = response;
      let dataEstab = this.establecimientos.find(item=>item.predeterminado);
      if(dataEstab){
        this.establecimientoId = dataEstab.idEstablecimiento;
        this.loadData();
      }
    });
  }

  ngOnInit(): void {
    this.getEstabs();
  }

  ngAfterViewInit(): void {
    // Asignar el template después de que la vista se haya inicializado
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });

  }


  onDelete(item: Floor) {
    swal
      .fire({
        icon: 'warning',
        title: 'Aviso!',
        text: `Esta seguro/a de eliminar este piso: ${item.description}?`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        showCancelButton: true,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this._floorUseCase.remove(item.id).subscribe((result) => {
            this.#tS.toastr({
              type: result.code == '1' ? 'success' : 'warning',
              message: result.message,
            });
            if (result.code == '1') {
              this.refresh( );
            }
          });
        }
      });
  }

  onModalOpen(data?: Floor) {
    const modalRef = this.#modalService.openModalCustom(
      FloorAddEditModalComponent,
      {
        size: 'lg',
        centered: true,
      },
    );
    modalRef.componentInstance.data = {
      establecimientoId: this.establecimientoId,
    };
    if (data && data.id > 0) {
      modalRef.componentInstance.data = Object.assign(data, {
        establecimientoId: this.establecimientoId,
      });
    }
    modalRef.result.then((response) => {
      if (response && typeof response == 'object') {

          this.refresh( );
      }
    });
  }
}
