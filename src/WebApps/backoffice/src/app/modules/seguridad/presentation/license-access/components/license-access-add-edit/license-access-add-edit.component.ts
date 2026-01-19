import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatThemeButtonComponent} from "acontplus-ui-components";
import {LicenseAccessService} from "@modules/seguridad/data/license-access/license-access.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-license-access-add-edit',
    imports: [
      ReactiveFormsModule,
      MatDialogModule,
      MatFormFieldModule,
      MatSelectModule,
      MatThemeButtonComponent
    ],
  templateUrl: './license-access-add-edit.component.html',
  styles: ``
})
export class LicenseAccessAddEditComponent {
  private dialogRef = inject(MatDialogRef<LicenseAccessAddEditComponent>);
  private $licenseAccessSvc = inject(LicenseAccessService);
  licenciaAccesoForm = new FormGroup({
    licenciaId: new FormControl(0, Validators.required),
    roleId: new FormControl(0, Validators.required),
  });

  licenses = signal<any[]>([])
  roles = signal<any[]>([])


  ngOnInit(){
    this.$licenseAccessSvc.getDataForm().subscribe(response=>{
      console.log(response);
      this.licenses.set(response.licenses);
      this.roles.set(response.roles);
    })
  }

  get licenciaId (){
    return this.licenciaAccesoForm.get('licenciaId');
  }

  licenseChange(){
    console.log(this.licenciaId?.value)
  }


  save(){

  }

  close(){
    this.dialogRef.close()
  }
}
