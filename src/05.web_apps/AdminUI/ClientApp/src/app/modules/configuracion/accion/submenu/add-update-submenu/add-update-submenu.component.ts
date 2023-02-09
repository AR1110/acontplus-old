import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Menu } from '@app/models/config/menu.model';
import { SubmenuService } from '@services/config/submenu.service';
import { SubmenuComponent } from '../submenu.component';

@Component({
  selector: 'app-add-update-submenu',
  templateUrl: './add-update-submenu.component.html',
  styleUrls: ['./add-update-submenu.component.css']
})
export class AddUpdateSubmenuComponent implements OnInit {
  tipoRegistro:number=1;
  dataForm!:FormGroup;
  menus:Menu[]=[];

  constructor(
    private formBuilder: FormBuilder,
    private subMenuSvc: SubmenuService,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any,
    private dialogRef: MatDialogRef<SubmenuComponent>,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.getMenuAll();

    this.dataForm = this.formBuilder.group({
      idMenu:[null, Validators.required],
      codigo:['', Validators.required],
      descripcion: ['', Validators.required],
      urlSubMenu:['', Validators.required],
      icono:['', Validators.required],
      estado:[false]
    });

    if(this.dataEdit){
      this.tipoRegistro = 2;

      this.dataForm.controls["idMenu"].setValue(this.dataEdit.idMenu);
      this.dataForm.controls["codigo"].setValue(this.dataEdit.codigo);
      this.dataForm.controls["descripcion"].setValue(this.dataEdit.descripcion);
      this.dataForm.controls["urlSubMenu"].setValue(this.dataEdit.urlSubMenu);
      this.dataForm.controls["icono"].setValue(this.dataEdit.icono);
      this.dataForm.controls["estado"].setValue(this.dataEdit.estado);

    }
  }

  getMenuAll(){
    this.subMenuSvc.getMenuAll().subscribe({
      next: response=>{
        this.menus = JSON.parse(response.payload);
      }
    })
  }

  saveAndUpdate(){
    if(this.dataForm.invalid){
      this.toast.warning('Ingrese todos los valores requeridos');
      return
    }

    if(this.tipoRegistro===1){
      this.save();
    }else{
      this.update();
    }
  }

  save(){
    this.subMenuSvc.save(this.dataForm.value).subscribe(response=>{
      console.log(response)
      const parseResponse = JSON.parse(response.payload)[0] || {code:'', message:''}
      if(parseResponse.code==="0"){
        this.toast.success(parseResponse.message);
        this.dialogRef.close(this.tipoRegistro);
        this.dataForm.reset();
        return
      }

      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
    })
  }


  update(){
    console.log(this.dataForm.value)
    this.subMenuSvc.update(this.dataEdit.idSubMenu, this.dataForm.value).subscribe(response=>{
      const parseResponse = JSON.parse(response.payload)[0] || {code:'', message:''}
      if(parseResponse.code==="0"){
        this.toast.success(parseResponse.message);
        this.dialogRef.close(this.tipoRegistro);
        this.dataForm.reset();
        return
      }

      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
    })
  }


}
