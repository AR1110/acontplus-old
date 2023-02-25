import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuService } from '@app/modules/admin/data/services/menu.service';
import { IMenu } from '@app/modules/admin/domain/models/menu.model';

@Component({
  selector: 'app-modal-menu',
  templateUrl: './modal-menu.component.html',
  styleUrls: ['./modal-menu.component.css']
})
export class ModalMenuComponent implements OnInit {

  tipoRegistro='N';

  dataForm:FormGroup = new FormGroup({})

  constructor(
    private _fb:FormBuilder,
    private _dialogRef: MatDialogRef<ModalMenuComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit:IMenu,
    private _menuSvc: MenuService
  ){}


  ngOnInit(): void {

    this.dataForm = new FormGroup(
      {
          descripcion: new FormControl('', [
              Validators.required
          ]),
          codigo: new FormControl('', [
            Validators.required
          ]),
          urlMenu: new FormControl('', [
            Validators.required
          ]),
          icono: new FormControl('', [
            Validators.required
          ])
      })

      if(this.dataEdit)
      {
        this.tipoRegistro = 'E';
        this.dataForm.controls["codigo"].setValue(this.dataEdit.codigo);
        this.dataForm.controls["urlMenu"].setValue(this.dataEdit.urlMenu);
        this.dataForm.controls["icono"].setValue(this.dataEdit.icono);
        this.dataForm.controls["descripcion"].setValue(this.dataEdit.descripcion);
      }


  }


  save(){
    if(this.dataForm.invalid) return

    if(this.tipoRegistro==='N'){
      this._menuSvc.save(this.dataForm.value).subscribe(response=>{
        console.log(response)
      })
    }else{
      this._menuSvc.update(this.dataEdit.idMenu, this.dataForm.value).subscribe(response=>{
        console.log(response)
      })
    }


  }


}
