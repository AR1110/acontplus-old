import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, inject} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import {AccesoMenu, LicenciaMenu} from "@modules/config/models/menu.model";
import {UserCustomerRoleStateService} from "@modules/config/store/user-customer/user-customer-role-state.service";
import {UserCustomerRoleService} from "@modules/config/services/user-customer/user-customer-role.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {CommonModule} from "@angular/common";
import {ToasterService} from "@core/services/toaster.service";
import Swal from "sweetalert2";
import {isApiResponse} from "@core/models/api-response";

interface FoodNode {
  name: string;
  children?: FoodNode[];
  checked?: boolean;
  subMenuId?: number
  actions?: any[] | null
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  checked?: boolean;

  subMenuId?: number
  actions?:any[] | null
}




@Component({
  selector: 'app-user-customer-role-access',
  standalone: true,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    FontAwesomeModule,
    NgbPopoverModule,
    MatSlideToggleModule
  ],
  templateUrl: './user-customer-role-access.component.html',
  styles: ``
})
export class UserCustomerRoleAccessComponent {

  tS = inject(ToasterService)
  state = inject(UserCustomerRoleStateService)
  userRoleId = this.state.select("userRoleId")

  userCustomerRoleSvc = inject(UserCustomerRoleService)

  licenciaMenus:LicenciaMenu[]=[];
  accesoMenus:AccesoMenu[]=[]

  mainNodes: FoodNode[] =[];



  cloneActions: any[]=[]
  actions:any[]=[]
  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      checked: node.checked,
      actions: node.actions,
      subMenuId: node.subMenuId
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<FoodNode, ExampleFlatNode>(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  checklistSelection = new SelectionModel<ExampleFlatNode>(true /* multiple */);

  getAccesses(){
    this.userCustomerRoleSvc.getAccesses(this.userRoleId()).subscribe(response=>{
      this.licenciaMenus = response.licenciaMenus;
      this.accesoMenus = response.accesoMenus;

      this.actions = structuredClone(response.actions)
      this.cloneActions = structuredClone(this.actions)
      this.mainNodes = [{
        name: 'Todos',
        children: this.licenciaMenus.map(m=>{
          let {subMenus, ...rest} = m;
          return {
            ...rest,
            children: subMenus
          }
        })
      }]

      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.checklistSelection = new SelectionModel<ExampleFlatNode>(true /* multiple */);
      this.dataSource.data = this.mainNodes;
      this.expandFirstLevelNodes();
    })
  }
  ngOnInit(){
    this.getAccesses()
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  todoItemSelectionToggle(node: ExampleFlatNode): void {
    this.checklistSelection.toggle(node);
    this.toggleDescendantsSelection(node);
    this.checkAllParentsSelection(node);
  }

  toggleDescendantsSelection(node: ExampleFlatNode): void {
    const descendants = this.treeControl?.getDescendants(node);
    descendants.forEach(child => {
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(child)
        : this.checklistSelection.deselect(child);
      this.toggleDescendantsSelection(child);
    });
  }

  checkAllParentsSelection(node: ExampleFlatNode): void {
    let parent: ExampleFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: ExampleFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: ExampleFlatNode): ExampleFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getLevel = (node: ExampleFlatNode) => node.level;



  isNodeIndeterminate(node: ExampleFlatNode): boolean {


    const descendants = this.treeControl?.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    const descAllDeselected = descendants.every(child =>
      !this.checklistSelection.isSelected(child)
    );

    return !descAllSelected && !descAllDeselected;
  }

  expandFirstLevelNodes(): void {
    this.treeControl.dataNodes.forEach(node => {
      if (node.level === 0) {
        this.treeControl.expand(node);
      }
    });
  }

  dataSubNode: any = {};
  onClickActions(node: ExampleFlatNode){
   console.log(this.treeControl.dataNodes)
    this.dataSubNode = node;
    for(let item of this.actions){
      item.checked = this.dataSubNode.actions.some((m:any)=>m.code===item.code)
    }
  }


  toggleAction(action:any){
    for(let item of this.treeControl.dataNodes){
      if(!item.subMenuId ||  !item.actions) continue;

      if(item.subMenuId===this.dataSubNode.subMenuId){
        if(action.checked){
          item.actions.push({
            code: action.code,
            name: action.name,
          })
        }else{
          item.actions =  item.actions.filter((a:any)=>a.code!==action.code)
        }
      }

    }
  }

  actionHidden(){
    this.dataSubNode = {};
    this.actions = structuredClone(this.cloneActions)
  }



  onSave(){
    const checklistSelection = this.checklistSelection.selected;

    if(checklistSelection.length===0){
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos un SubMenu'
      })
      return
    }

    if (checklistSelection.some((s:any) => (s.actions?.length === 0))) {
      this.tS.toastr({
        type: 'warning',
        message: '¡Agregue al menos una acción de todos los submenús seleccionados!'
      });
      return;
    }

    Swal.fire({
      icon: 'warning',
      text: 'Esta seguro de actualizar los accesos de manera personalizada al usuario seleccionado?',
      showCancelButton: true,
      showConfirmButton : true,
      cancelButtonText: 'No!',
      confirmButtonText: 'Si!'
    }).then(result=>{

        if(result.isConfirmed) {

          let accesoMenus = this.accesoMenus.flatMap(am => am.subMenus).map(sm => {
            return {
              subMenuId: sm.subMenuId,
              actions: sm.actions
            }
          })

          let accesoCustom = checklistSelection.map(sm => {
            return {
              subMenuId: sm.subMenuId,
              actions: JSON.stringify(sm.actions)
            }
          })

          let results = [...accesoMenus, accesoCustom]

          let data = {
            accesses: results
          }
          this.userCustomerRoleSvc.updateAcceses(this.userRoleId(), data).subscribe(response => {
            if (isApiResponse(response)) {
              if (response.code === "0") {
                this.tS.toastr({
                  type: 'warning',
                  message: response.message
                })
              }
              if (response.code === "1") {
                this.tS.toastr({
                  type: 'success',
                  message: response.message
                })
              }
            }
          })
        }



    })

  }

}
