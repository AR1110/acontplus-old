import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-add-edit-modal',
  standalone: true,
  imports: [AppModule],
  templateUrl: './add-edit-modal.component.html',
  styles: ``,
})
export class AddEditModalComponent implements OnInit {
  data: any = {};

  private fb = inject(FormBuilder);

  customerForm = this.fb.group({
    idCliente: [0],
    bussinesName: ['', Validators.required],
  });

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.idCliente > 0) {
      this.customerForm.patchValue({ bussinesName: this.data.bussinesName });
    }
  }
}
