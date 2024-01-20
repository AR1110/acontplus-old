import { Component, OnInit, inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, Validators } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppModule } from 'src/app/app.module';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MaterialModule } from '@core/material/material.module';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-add-edit-modal',
  standalone: true,
  imports: [AppModule, MaterialModule, NgbTooltipModule],
  templateUrl: './add-edit-modal.component.html',
  styles: ``,
})
export class AddEditModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private announcer = inject(LiveAnnouncer);
  private modalRef = inject(NgbActiveModal);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  addOnBlur = true;
  data: any = {};
  emails: string[] = [];
  modalIcon: IconProp = 'plus';
  modalTitle = 'Nuevo Cliente';
  telephones: string[] = [];
  tiposIdentificacion: any = [];

  customerForm = this.fb.group({
    direccion: ['', Validators.required],
    idCliente: [0],
    idTipoIdentificacion: [Validators.required],
    nombreFiscal: ['', Validators.required],
    numeroIdentificacion: ['', Validators.required],
  });

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.emails.push(value);
    }
    event.chipInput!.clear();
  }
  editEmail(fruit: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removeEmail(fruit);
      return;
    }
    const index = this.emails.indexOf(fruit);
    if (index >= 0) {
      this.emails[index] = value;
    }
  }
  removeEmail(telephone: string): void {
    const index = this.telephones.indexOf(telephone);
    if (index >= 0) {
      this.telephones.splice(index, 1);
      this.announcer.announce(`Removed ${telephone}`);
    }
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.telephones.push(value);
    }
    event.chipInput!.clear();
  }
  editTelephone(fruit: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removeEmail(fruit);
      return;
    }
    const index = this.telephones.indexOf(fruit);
    if (index >= 0) {
      this.telephones[index] = value;
    }
  }
  removeTelephone(telephone: string): void {
    const index = this.telephones.indexOf(telephone);
    if (index >= 0) {
      this.telephones.splice(index, 1);
      this.announcer.announce(`Removed ${telephone}`);
    }
  }

  closeModal() {
    this.modalRef.close();
  }

  copyTradeName() {}

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.idCliente > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Cliente';
      this.customerForm.patchValue({ nombreFiscal: this.data.bussinesName });
    }
  }
  onChangeTipoIdentificacion() {}

  save() {
    const data = {
      ...this.customerForm.value,
    };
    console.log(data);
  }
}
