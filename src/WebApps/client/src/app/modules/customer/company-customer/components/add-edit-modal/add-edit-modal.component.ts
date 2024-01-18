import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-add-edit-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './add-edit-modal.component.html',
  styles: ``,
})
export class AddEditModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NgbActiveModal);
  data: any = {};
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nuevo Cliente';
  tiposIdentificacion: any = [];

  customerForm = this.fb.group({
    idCliente: [0],
    bussinesName: ['', Validators.required],
  });
  closeModal() {
    this.modalRef.close();
  }

  copyTradeName() {}

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.idCliente > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Cliente';
      this.customerForm.patchValue({ bussinesName: this.data.bussinesName });
    }
  }
  onChangeTipoIdentificacion() {}
}
