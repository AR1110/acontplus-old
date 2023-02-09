import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlanClienteService } from '@app/services/config/plan-cliente.service';
import { PlanCliente } from '@app/models/config/plan-cliente.model';
import { ToastrService } from 'ngx-toastr';
import { AddUpdatePlanClienteComponent } from './add-update-plan-cliente/add-update-plan-cliente.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-plan-cliente',
  templateUrl: './plan-cliente.component.html',
  styleUrls: ['./plan-cliente.component.css']
})
export class PlanClienteComponent implements OnInit {
  displayedColumns:string[]=['index', 'ruc', 'licencia', 'suscripcion', 'valor', 'estado', 'op'];
  dataSource!:MatTableDataSource<PlanCliente>;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  constructor(
    private _dialog:MatDialog,
    private _toastr:ToastrService,
    private _pCSvc:PlanClienteService
  ) { }

  ngOnInit(): void {
    this.getAll();

  }

  getAll(){
    this._pCSvc.getAll().subscribe(({payload})=>{
      this.dataSource = new MatTableDataSource(JSON.parse(payload));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.data)
    })
  }

  planClienteFilter(e:Event){
    const txtFilter = (e.target as HTMLInputElement).value;
    this.dataSource.filter = txtFilter;
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  openModalAdd(){
    const dialogRef = this._dialog.open(AddUpdatePlanClienteComponent, {width:'50%'});
    dialogRef.afterClosed().subscribe(tipo=>{
      if(tipo===1){
        this.getAll();
      }
    })
  }

  openModalUpdate(data:any){
    const dialogRef = this._dialog.open(AddUpdatePlanClienteComponent, {width:'50%', data});
    dialogRef.afterClosed().subscribe(tipo=>{
      if(tipo===2){
        this.getAll();
      }
    })
  }

  async swalFireDelete(data:any){
    let {isConfirmed} = await Swal.fire({
      icon:'warning',
      html:`<small>Esta seguro de eliminar este Plan Cliente ahora?</small>`,
      confirmButtonText:'Si, eliminar',
      showDenyButton:true,
      denyButtonText:'No, cancelar',
      allowEscapeKey:false,
      allowOutsideClick:false
    });
    if(isConfirmed){
      this._pCSvc.delete(data.idPlanCliente).subscribe(response=>{
        if(response.code==="-2"){
          this._toastr.warning(response.message);
          return
        }
        if(response.code==="0"){
          this.getAll();
          this._toastr.success(response.message)
        }
      });
    }
  }




}
