import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-anticipo-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './anticipo-modal.component.html',
  styles: ``
})
export class AnticipoModalComponent {
  private activeModal = inject(NgbActiveModal);

  textBtn = 'Guardar';
  iconBtn = 'save';

  dataForm = new FormGroup({
    codEstab: new FormControl('', Validators.required),
    idCaja: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idTipoDocumento: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idSubEntidadFinanciera: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    idEmpleado: new FormControl(0, [Validators.required, this.greaterThanZeroValidator]),
    valor: new FormControl(0, Validators.required),
    observaciones: new FormControl('', Validators.required),
    employeeName: new FormControl('')
  });

  greaterThanZeroValidator(control: AbstractControl<number>): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value <= 0)) {
      return { lessThanZero: true }; // Validation failed
    }
    return null; // Validation passed
  }


  save() {
    try {

    } catch (error) {
      console.log(error)
    }
  }

  closeModal() {
    this.activeModal.close();
  }

}
