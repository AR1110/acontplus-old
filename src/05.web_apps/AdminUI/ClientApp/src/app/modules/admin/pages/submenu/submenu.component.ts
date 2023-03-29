import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IMenu } from '../../domain/models/menu.model';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent {
  displayedColumns: string[]=['index','idSubMenu', 'codigo', 'descripcion', 'urlSubMenu', 'estado', 'op'];
  dataSource!:MatTableDataSource<Submenu>
  menus:IMenu[]=[];
}
