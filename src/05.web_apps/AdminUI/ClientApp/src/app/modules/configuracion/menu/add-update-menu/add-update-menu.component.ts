import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuService } from '@services/config/menu.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-menu',
  templateUrl: './add-update-menu.component.html',
  styleUrls: ['./add-update-menu.component.css']
})
export class AddUpdateMenuComponent implements OnInit {
  dataForm! : FormGroup;
  tipoRegistro:number = 1 // Default 1 add ;

  constructor(
    private formBuilder : FormBuilder,
    private _mS : MenuService,
    @Inject(MAT_DIALOG_DATA) private editData : any,
    private dialoRef: MatDialogRef<AddUpdateMenuComponent>,
    private _toastr : ToastrService,

  ) {}

  ngOnInit(): void {
    this.dataForm = this.formBuilder.group({
        codigo :['',Validators.required],
        urlMenu : ['',Validators.required],
        icono : ['',Validators.required],
        descripcion : ['',Validators.required]

    });

    if(this.editData)
    {
      this.tipoRegistro = 2;
      this.dataForm.controls["codigo"].setValue(this.editData.codigo);
      this.dataForm.controls["urlMenu"].setValue(this.editData.urlMenu);
      this.dataForm.controls["icono"].setValue(this.editData.icono);
      this.dataForm.controls["descripcion"].setValue(this.editData.descripcion);
    }

  }

  addUpdate()
  {
    if(this.dataForm.valid)
    {
      if(this.tipoRegistro == 1)
      {
        this._mS.save(this.dataForm.value).subscribe(response=>{
          if(response.code==="-2"){
            this._toastr.warning(response.message);
            return
          }
          if(response.code==="0"){
            this.dataForm.reset();
            this.dialoRef.close(this.tipoRegistro);
            this._toastr.success(response.message);
          }
        })
      }

      else
      {
        this._mS.update(this.editData.idMenu, this.dataForm.value).subscribe(response=>{
          if(response.code==="-2"){
            this._toastr.warning(response.message);
            return
          }
          if(response.code==="0"){
            this.dataForm.reset();
            this.dialoRef.close(this.tipoRegistro);
            this._toastr.success(response.message);
          }
        })
      }
    }
  }

}
