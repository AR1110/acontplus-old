
import {Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
import { ModalService } from "@core/services/modal.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SubEntidadFinancieraRead } from "@accounting/core/domain/subentidad-financiera.model";
import { SubEntidadFinancieraModalComponent } from "@accounting/ui/sub-entidad-financiera/sub-entidad-financiera-modal/sub-entidad-financiera-modal.component";
import { hideLoader, showLoader } from "@core/utils/loader";
import Swal from "sweetalert2";
import { isApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import {EntidadFinanciera} from "@accounting/core/domain/entidad-financiera.interface";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SubEntidadFinancieraUsecase} from "@accounting/core/usecases/sub-entidad-financiera.usecase";



@Component({
    selector: 'app-sub-entidad-financiera-page',
    imports: [
      MatCardModule,
      MatExpansionModule,
        FontAwesomeModule,
        FormsModule,
      MatIconModule,
      MatButtonModule,
        BreadcrumbComponent,
      MatDynamicTableComponent
    ],
    templateUrl: './sub-entidad-financiera-page.component.html'
})
export class SubEntidadFinancieraPageComponent {
  private readonly modalSvc = inject(ModalService);
  private readonly tS = inject(ToasterService)
  private useCase = inject(SubEntidadFinancieraUsecase)

  entidadesFinanciera: Array<EntidadFinanciera> = [];
  cloneSubEntidadesFinanciera: Array<SubEntidadFinancieraRead> = [];

  subEntidadesFinanciera = new MatTableDataSource<SubEntidadFinancieraRead>();

  dataEntidadFinanciera = {} as EntidadFinanciera

  columnsDefs: ColumnDefinition[] = [

    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'codigo', label: 'Código', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  getData() {

      this.useCase.getAll().subscribe(data => {
        this.entidadesFinanciera = structuredClone(data.entidadesFinancieras);
        this.cloneSubEntidadesFinanciera = structuredClone(data.subEntidadesFinancieras);
        if (this.dataEntidadFinanciera.idEntidadFinanciera > 0) {
          this.showAcordeon(this.dataEntidadFinanciera)
        }
    })

  }


  showAcordeon(dataEntidadFinanciera: EntidadFinanciera) {
    this.dataEntidadFinanciera = dataEntidadFinanciera;
    this.subEntidadesFinanciera.data = [];

    let subEntidadFiltered  = this.cloneSubEntidadesFinanciera.filter(e => e.idEntidadFinanciera === dataEntidadFinanciera.idEntidadFinanciera);

    this.subEntidadesFinanciera = new MatTableDataSource(structuredClone(subEntidadFiltered))
  }


  ngOnInit() {
    this.getData();
  }

  openModal(data?: SubEntidadFinancieraRead) {
    const modalRef = this.modalSvc.openModalCustom(
      SubEntidadFinancieraModalComponent
    )
    let params = {
      idEntidadFinanciera: this.dataEntidadFinanciera?.idEntidadFinanciera,
      nameEntidadFinanciera: this.dataEntidadFinanciera?.descripcion,
    }

    params = data ? { ...params, ...data } : params

    modalRef.componentInstance.params = params;
    modalRef.result.then(result => {
      if (result !== null && typeof result === 'object') {
        this.getData();
      }
    })
  }

  askToDelete(data: SubEntidadFinancieraRead) {
    try {
      Swal.fire({
        icon: 'warning',
        html: '<small>Esta seguro/a de eliminar este registro ahora?</small>',
        showDenyButton: true,
        confirmButtonText: `Si, eliminar`,
        denyButtonText: `No, cancelar`,
        allowOutsideClick: false
      }).then(result => {
        if (result.isConfirmed) {
          showLoader();
          this.useCase.delete(data.idSubEntidadFinanciera).subscribe({
            next: (value) => {
              hideLoader();
              if (isApiResponse(value)) {
                if (value.code === "0") {
                  this.tS.toastr({
                    type: 'warning',
                    message: value.message
                  })
                }
                if (value.code === "1") {
                  this.tS.toastr({
                    type: 'success',
                    message: value.message
                  })
                  this.getData();
                }
              }
            },
            error(err) {
              hideLoader();
              console.log(err)
            },
          })
        };
      });
    } catch (error) {
      hideLoader();
      console.log(error)
    }
  }
}
