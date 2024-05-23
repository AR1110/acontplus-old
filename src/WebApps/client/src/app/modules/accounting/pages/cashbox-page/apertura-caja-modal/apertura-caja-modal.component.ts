import { Component, Input, inject } from '@angular/core';
import {FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { EntidadFinanciera } from '@modules/accounting/models/entidad-financiera.model';
import { ControlCajaService } from '@modules/accounting/services/control-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-apertura-caja-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './apertura-caja-modal.component.html',
})
export class AperturaCajaModalComponent {
  private activeModal = inject(NgbActiveModal);
  private controlCajaSvc = inject(ControlCajaService)
  private tS = inject(ToasterService);

  @Input() params = {
    idCaja: 0,
  }

  entidadesFinanciera: Array<EntidadFinanciera> = [];

  dataForm = new FormGroup({
    idCaja: new FormControl(0),
    idEntidadFinanciera: new FormControl(0, Validators.required),
    concepto: new FormControl('', Validators.required),
    entrada: new FormControl(0, Validators.required),
  });

  ngOnInit() {
    this.dataForm.get('idCaja')?.setValue(this.params.idCaja)


    this.controlCajaSvc.getDataForm().subscribe(  (response) => {

        let { formaPagos } = response as { formaPagos: any }
        this.entidadesFinanciera = formaPagos;
    })
  }

  save() {
    try {
      let data = this.dataForm.value;

       if (this.dataForm.invalid) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese todos los campos requeridos!'
        })
        return
      }
       if(!(typeof data.idEntidadFinanciera=='number' && data.idEntidadFinanciera>0)){
         this.tS.toastr({
           type: 'warning',
           message: 'Ingrese todos los campos requeridos!'
         })
         return
       }

      if (data.idCaja && data.idCaja > 0) {
        this.controlCajaSvc.post(data).subscribe( (response) => {
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
                this.activeModal.close(response)
              }
            }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }


  closeModal() {
    this.activeModal.close()
  }

}
