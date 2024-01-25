import { Component, Input, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { EntidadFinanciera } from '@modules/accounting/models/entidad-financiera.model';
import { ControlCajaService } from '@modules/accounting/services/control-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-apertura-caja-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './apertura-caja-modal.component.html',
  styleUrl: './apertura-caja-modal.component.scss'
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


    showLoader();
    this.controlCajaSvc.getDataForm().subscribe({
      next: (response) => {
        hideLoader();
        let { formaPagos } = response as { formaPagos: any }
        this.entidadesFinanciera = formaPagos;
      },
      error(err) {
        hideLoader();
        console.log(err)
      },
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

      if (data.idCaja && data.idCaja > 0) {
        showLoader();
        this.controlCajaSvc.post(data).subscribe({
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
                this.activeModal.close(response)
              }
            }
          }, error(err) {
            hideLoader()
            console.log(err)
          },
          complete() {
            hideLoader();
          },
        })
      }
    } catch (error) {
      console.log(error);
      hideLoader();
    }
  }


  closeModal() {
    this.activeModal.close()
  }

}
