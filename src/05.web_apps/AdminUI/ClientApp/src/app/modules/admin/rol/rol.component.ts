import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RolService } from '@services/admin/rol.service';
import { Rol } from '@app/models/admin/rol.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AddUpdateRolComponent } from './add-update-rol/add-update-rol.component';
import { AccesoMenuComponent } from '../acceso-menu/acceso-menu.component';
import { DuplicarRolComponent } from './duplicar-rol/duplicar-rol.component';

@Component({
   selector: 'app-rol',
   templateUrl: './rol.component.html',
   styleUrls: ['./rol.component.css']
})


export class RolComponent implements OnInit {
   displayedColumns:string[]=['index', 'ruc', 'codigo', 'rol', 'licencia', 'op'];
   dataSource!:MatTableDataSource<Rol>;

   @ViewChild(MatPaginator) paginator!:MatPaginator;
   @ViewChild(MatSort) sort!:MatSort;

   constructor(
      private _dialog:MatDialog,
      private _rSvc: RolService,
      private _toastr:ToastrService,
   ) { }

   ngOnInit(): void {
      this.getAll();
   }

   getAll(){
      this._rSvc.getAll().subscribe(response=>{
         this.dataSource = new MatTableDataSource(response);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
      })
   }

   rolFilter(e:Event){
      const txtFilter =(e.target as HTMLInputElement).value;
      this.dataSource.filter = txtFilter;

      if(this.dataSource.paginator){
         this.dataSource.paginator.firstPage();
      }
   }


   openModalAdd(){
      const dialogRef = this._dialog.open(AddUpdateRolComponent, {width:'40%'})
      dialogRef.afterClosed().subscribe(tipo=>{
         if(tipo===1){
            this.getAll();
         }
      })
   }

   openModalUpdate(data:any){
      const dialogRef = this._dialog.open(AddUpdateRolComponent, {width:'40%', data})
      dialogRef.afterClosed().subscribe(tipo=>{
         if(tipo===2){
            this.getAll();
         }
      })
   }


   async swalFireDelete(data:any){
      let {isConfirmed} = await Swal.fire({
         icon:'warning',
         html:`<small>Esta seguro de eliminar esta <strong>Rol</strong> ahora?</small>`,
         confirmButtonText:'Sí, eliminar',
         showDenyButton:true,
         denyButtonText:'No, cancelar',
         allowEscapeKey:false,
         allowOutsideClick:false
      })

      if(isConfirmed){
         this._rSvc.delete(data.idRol).subscribe(response=>{
            if(response.code==="-2"){
               this._toastr.warning(response.message);
               return
            }
            if(response.code==="0"){
               this.getAll();
               this._toastr.success(response.message)
            }
         })
      }
   }

   openModalAcceso(data:any){
      this._dialog.open(AccesoMenuComponent, {width:'60%', data})
   }

   openModalDuplicar(data:any){
      this._dialog.open(DuplicarRolComponent, {width:'50%', data}).afterClosed().subscribe(response=>{
         this.getAll();
      })
   }

}
