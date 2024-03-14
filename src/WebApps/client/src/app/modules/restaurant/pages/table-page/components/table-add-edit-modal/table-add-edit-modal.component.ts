import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-table-add-edit',
  templateUrl: './table-add-edit-modal.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule]
})
export class TableAddEditComponent {
  activeModal = inject(NgbActiveModal);

  dataForm = new FormGroup({
    idCaja: new FormControl(0),
    idEntidadFinanciera: new FormControl(0, Validators.required),
    concepto: new FormControl('', Validators.required),
    entrada: new FormControl(0, Validators.required),
  });


  save(){

  }

  closeModal (){
    this.activeModal.close()
  }
}