import {Component, inject, signal, TemplateRef, ViewChild} from '@angular/core';
import {
  ListAsignacionEstabUseCase
} from "@modules/config/application/use-cases/asignacion-estab/list-asignacion-estab.use-case";
import {UserCustomerStore} from "@modules/config/application/store/user-customer.store";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatPagination} from "@shared/models/pagination.model";
import {AsignacionEstabList} from "@modules/config/domain/models/user-customer/asignacion-estab.model";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {
  UpdateAsignacionEstabUseCase
} from "@modules/config/application/use-cases/asignacion-estab/update-asignacion-estab.use-case";
import {ToastrNotificationService} from "@core/services/toastr-notification.service";
import Swal from "sweetalert2";
import {
  CreateAsignacionEstabUseCase
} from "@modules/config/application/use-cases/asignacion-estab/create-asignacion-estab.use-case";
import {DialogService} from "@core/services/dialog.service";
import {
  AsignacionBodegaPuntoEmisionDialogComponent
} from "@modules/config/ui/user-customer/setting-user-customer/asignacion-bodega-punto-emision-dialog/asignacion-bodega-punto-emision-dialog.component";


@Component({
  selector: 'app-list-asignacion-estab',
    imports: [
        MatSlideToggleModule,
        FormsModule,
        MatDynamicTableComponent,
        MatIcon,
        MatIconButton,
    ],
  templateUrl: './list-asignacion-estab.component.html',
  styles: ``
})
export class ListAsignacionEstabComponent {
  private $listAsignacionEstabUseCase = inject(ListAsignacionEstabUseCase)
  private $updateAsignacionEstabUseCase = inject(UpdateAsignacionEstabUseCase)
  private $createAsignacionEstabUseCase = inject(CreateAsignacionEstabUseCase)
  private $userCustomerStore = inject(UserCustomerStore);
  private _tS = inject(ToastrNotificationService)
  private _dialogSvc = inject(DialogService)
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  $loading = signal(false)

  dataSource = signal<AsignacionEstabList[]>([])

  columnsDefs: ColumnDefinition[] = [

    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'estab', label: 'Nro. Estab', type: 'string' },
    { key: 'nombreComercial', label: 'Nombre Comercial', type: 'string' },
    { key: 'predeterminado', label: 'Predeterminado', type: 'template' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key)

  pagination = signal(new MatPagination());

  private getList(){
    this.$listAsignacionEstabUseCase.execute({
      userRoleId: this.$userCustomerStore.userRoleId()
    }).subscribe(response=>{
      this.dataSource.set(response.data)
    })
  }

  ngOnInit(){
this.getList()

  }

  ngAfterViewInit(): void {
    this.columnsDefs.forEach((col) => {
      if (col.type === 'template') {
        col.templateOutlet = this.statusTemplate;
      }
    });
  }


  onChangeDefault(data: AsignacionEstabList) {
    this.$updateAsignacionEstabUseCase.execute(data).subscribe((response) => {
        if (response.code === "0") {
          this._tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if (response.code === "1") {
          this._tS.toastr({
            type: 'success',
            message: response.message
          })
          this.getList()
        }
    })
  }

  async addEstab(data: AsignacionEstabList) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger m-2'
      },
      buttonsStyling: false
    })

    let {
      isConfirmed
    } = await swalWithBootstrapButtons.fire({
      html: `<small>Está seguro de ${data.idEstab_Asig > 0 ? 'quitar' : 'asignar'} este Establecimiento: <b>${data.nombreComercial}</b></small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${data.idEstab_Asig > 0 ? 'quitar' : 'asignar'}`,
      cancelButtonText: 'No, cancelar!',
      reverseButtons: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    })


    if (isConfirmed) {
      let params = {
        id: data.idEstab_Asig,
        idUsuarioRol: this.$userCustomerStore.userRoleId(),
        codEstab: data.codEstab
      }
      this.$createAsignacionEstabUseCase.execute(params).subscribe((response) => {
          if (response.code === "0") {
            this._tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code === "1") {
            this._tS.toastr({
              type: 'success',
              message: response.message
            })
            this.getList()
          }
      })

    }
  }


  openAsigBodegaPtoEmision(item: AsignacionEstabList) {
    const ref = this._dialogSvc.open(AsignacionBodegaPuntoEmisionDialogComponent, {
      size: 'lg',
      data: item
    })
  }

}
