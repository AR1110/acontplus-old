import { Component, ViewEncapsulation, inject } from '@angular/core';
import { hideLoader, showLoader } from '@core/utils';
import { ControlCajaService } from '@modules/accounting/services/control-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cashbox-close-modal',
  standalone: true,
  imports: [],
  templateUrl: './cashbox-close-modal.component.html',
  styleUrl: './cashbox-close-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CashboxCloseModalComponent {


  private activeModal = inject(NgbActiveModal);
  private controlCajaSvc = inject(ControlCajaService)

  ngOnInit(){
    showLoader();
    this.controlCajaSvc.getDataFormCashboxClose().subscribe({
      next: (response)=> {
        hideLoader();
        console.log(response)
      },
      error(err) {
          console.log(err)
          hideLoader()
      },
    })
  }
  closeModal(){
    this.activeModal.close();
  }
}
