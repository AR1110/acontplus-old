import { Component, inject } from '@angular/core';
import { MovimientoCajaRead } from '@modules/accounting/models/movimiento-caja.model';
import { MovimientoCajaService } from '@modules/accounting/services/movimiento-caja.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-egreso-ingreso',
  standalone: true,
  imports: [],
  templateUrl: './modal-egreso-ingreso.component.html',
})
export class ModalEgresoIngresoComponent {
  titleModal = 'Nuevo Egreso/Ingreso Caja';

  private activeModal = inject(NgbActiveModal);
  private movimientoCajaSvc = inject(MovimientoCajaService);

 

  ngOnInit(){
    console.log('load')
    this.movimientoCajaSvc.getDataForm().subscribe({
      next: (response)=> {
          console.log(response)
      },
    })
  }


  closeModal(){
    this.activeModal.close();
  }
}
