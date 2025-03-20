import {Component, inject, Input, signal} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { isApiResponse } from "@core/models/api-response";
import { ToasterService } from "@core/services/toaster.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserCustomerCustomerRoleBodega } from "@modules/config/domain/models/user-customer/user-customer-role-bodega.model";
import { UserCustomerCustomerRoleEstab } from "@modules/config/domain/models/user-customer/user-customer-role-estab.model";
import { UserCustomerCustomerRolePtoEmision } from "@modules/config/domain/models/user-customer/user-customer-role-punto-emision.model";
import { UserCustomerRoleBodegaService } from "@modules/config/services/user-customer/user-customer-role-bodega.service";
import { UserCustomerRolePuntoEmisionService } from "@modules/config/services/user-customer/user-customer-role-punto-emision.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin } from "rxjs";
import Swal from "sweetalert2";
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {MatDialogRef} from "@angular/material/dialog";
import {ColumnDefinition} from "@shared/models/mat-table-models/column-definition.model";
import {MatDynamicTableComponent} from "@shared/components/mat-dynamic-table/mat-dynamic-table.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";


@Component({
    selector: 'app-user-bodega-punto-emision-modal',
  imports: [
    MatSlideToggleModule,
    FontAwesomeModule,
    FormsModule,
    MatCustomDialogComponent,
    MatDynamicCardComponent,
    MatDynamicTableComponent,
    MatIcon,
    MatIconButton
  ],
    templateUrl: './asignacion-bodega-punto-emision-dialog.component.html'
})
export class AsignacionBodegaPuntoEmisionDialogComponent {

  private dialogRef = inject(MatDialogRef<AsignacionBodegaPuntoEmisionDialogComponent>)

  @Input() params: UserCustomerCustomerRoleEstab = {
    idEstab_Asig: 0,
    codEstab_Asig: "",
    codEstab: "",
    estab: "",
    nombreComercial: "",
    defaultEstab: false,
    estado: false
  }


  private userCustomerRoleBodegaSvc = inject(UserCustomerRoleBodegaService)
  private userCustomerRolePtoEmisionSvc = inject(UserCustomerRolePuntoEmisionService)
  private tS = inject(ToasterService)

  userCustomerRoleBodegas: UserCustomerCustomerRoleBodega[] = []
  userCustomerRolePuntosEmision: UserCustomerCustomerRolePtoEmision[] = []


  dataSourcePuntoEmision = signal([])
  dataSourceBodega = signal([])

  columnsDefsPuntoEmision: ColumnDefinition[] = [

    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'estab', label: 'Nro. Emisión', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
    { key: 'predeterminado', label: 'Predeterminado', type: 'template' },
  ];
  columnsPuntoEmision: string[] = this.columnsDefsPuntoEmision.map((colDef) => colDef.key)

  columnsDefsBodega: ColumnDefinition[] = [

    { key: 'index', label: '#', type: 'string' },
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'descripcion', label: 'Descripción', type: 'string' },
    { key: 'nomEstado', label: 'Estado', type: 'string' },
    { key: 'predeterminado', label: 'Predeterminado', type: 'template' },
  ];
  columnsBodega: string[] = this.columnsDefsBodega.map((colDef) => colDef.key)


  fetchAllData() {
    forkJoin([
      this.userCustomerRoleBodegaSvc.getAll(this.params.codEstab_Asig),
      this.userCustomerRolePtoEmisionSvc.getAll(this.params.codEstab_Asig)
    ]).subscribe( (response) => {
        const [bodegas, puntosEmision] = response;
        this.userCustomerRoleBodegas = bodegas;
        this.userCustomerRolePuntosEmision = puntosEmision;
    })
  }

  ngOnInit() {
    this.fetchAllData();
  }



  onChangePuntoEmisionDefault(item: UserCustomerCustomerRolePtoEmision) {
    try {
      this.userCustomerRolePtoEmisionSvc.put(item.idPtoEmi_Asig).subscribe((response) => {
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
              this.fetchAllData()
            }
          }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async addPuntoEmision(item: UserCustomerCustomerRolePtoEmision) {
    try {
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
        icon: 'warning',
        html: `<small>Está seguro de ${item.idPtoEmi_Asig > 0 ? 'quitar' : 'asignar'} este Punto de Emisión: <b>${item.ptoEmi}</b> a Sucursal: <b>${this.params.nombreComercial}</b></small>`,
        showCancelButton: true,
        confirmButtonText: `Sí, ${item.idPtoEmi_Asig > 0 ? 'quitar' : 'asignar'}`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: false,
        allowOutsideClick: false
      })

      if (isConfirmed) {
        let params = {
          ...item,
          codEstab_Asig: this.params.codEstab_Asig

        }
        this.userCustomerRolePtoEmisionSvc.post(params).subscribe((response) => {
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
                this.fetchAllData()
              }
          }
        })
      }
    } catch (error) {
    }
  }



  //Bodegas
  onChangeBodegaDefault(item: UserCustomerCustomerRoleBodega) {
    try {
      this.userCustomerRoleBodegaSvc.put(item.idBodeg_Asig).subscribe((response) => {
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
              this.fetchAllData()
            }
          }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async addBodega(item: UserCustomerCustomerRoleBodega) {
    try {
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
        icon: 'warning',
        html: `<small>Está seguro de ${item.idBodeg_Asig > 0 ? 'quitar' : 'asignar'} este Bodega: <b>${item.descripcion}</b> a Establecimiento: <b>${this.params.nombreComercial}</b></small>`,
        showCancelButton: true,
        confirmButtonText: `Sí, ${item.idBodeg_Asig > 0 ? 'quitar' : 'asignar'}`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: false,
        allowOutsideClick: false,
      })

      if (isConfirmed) {
        const params = {
          ...item,
          codEstab_Asig: this.params.codEstab_Asig

        }
        this.userCustomerRoleBodegaSvc.post(params).subscribe((response) => {
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
                this.fetchAllData()
              }
            }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  close(){
    this.dialogRef.close()
  }
}
