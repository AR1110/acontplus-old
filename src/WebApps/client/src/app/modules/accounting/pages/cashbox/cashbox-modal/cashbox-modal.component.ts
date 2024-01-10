import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isApiResponse } from '@core/models/api-response';
import { User } from '@core/models/user.model';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils';
import { Turno } from '@modules/accounting/models/turno.model';
import { CashboxService } from '@modules/accounting/services/cashbox.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-cashbox-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './cashbox-modal.component.html',
  styleUrl: './cashbox-modal.component.scss'
})
export class CashboxModalComponent {

  private activeModal = inject(NgbActiveModal);
  private cashboxSvc = inject(CashboxService);
  private tS = inject(ToasterService);

  @Input() params = {
    idCaja: 0,
    descripcion: '',
    idUsuario: 0,
    idTurno: 0
  }


  titleModal = 'Nueva Caja';
  btnIcon = 'ti-save';
  btnText = 'Guardar';
  tipoRegistro = 1;

  usuarios: Array<User> = [];
  turnos: Array<Turno> = [];

  dataForm = new FormGroup({
    idCaja: new FormControl(0),
    idUsuario: new FormControl(0, Validators.required),
    descripcion: new FormControl('', Validators.required),
    idTurno: new FormControl(0, Validators.required),
  });


  ngOnInit() {
    showLoader();
    this.cashboxSvc.getDataForm().subscribe({
      next: (response) => {
        hideLoader();
        let { turnos, usuarios } = response as { turnos: any, usuarios: any };

        this.usuarios = usuarios;
        this.turnos = turnos;

        if (typeof this.params === 'object' && this.params.idCaja > 0) {
          this.tipoRegistro = 2;
          this.titleModal = 'Editar Caja';
          this.btnIcon = 'ti-pencil';
          this.btnText = 'Actualizar';
          this.dataForm.get('idCaja')?.setValue(this.params.idCaja)
          this.dataForm.get('descripcion')?.setValue(this.params.descripcion)
          this.dataForm.get('idUsuario')?.setValue(this.params.idUsuario)
          this.dataForm.get('idTurno')?.setValue(this.params.idTurno)
        }

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

      if (data.idCaja && data.idCaja > 0) {
        showLoader();
        this.cashboxSvc.update(data.idCaja, data).subscribe({
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
      } else if (!(data.idCaja && data.idCaja > 0)) {
        showLoader();
        this.cashboxSvc.save(data).subscribe({
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
    this.activeModal.close();
  }

}
