import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils';
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

  entidadesFinanciera: Array<EntidadFinanciera> = [];

  dataForm = new FormGroup({
    idCaja: new FormControl(0),
    idEntidadFinanciera: new FormControl(0, Validators.required),
    concepto: new FormControl('', Validators.required),
    entrada: new FormControl(0, Validators.required),
  });

  ngOnInit() {
    console.log("0000")
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

  save(){
    
  }


  closeModal() {
    this.activeModal.close()
  }

}
