import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, inject} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import {AccesoMenu} from "@modules/config/domain/models/menu.model";
import {UserCustomerRoleStateService} from "@modules/config/store/user-customer/user-customer-role-state.service";
import {UserCustomerRoleService} from "@modules/config/services/user-customer/user-customer-role.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {ToasterService} from "@core/services/toaster.service";
import Swal from "sweetalert2";
import {isApiResponse} from "@core/models/api-response";
import { FormsModule } from '@angular/forms';

interface MenuNode {
  name: string;
  children?: MenuNode[];
  checked?: boolean;
  subMenuId?: number
  enabled?: boolean
  codeAction?:string
  unique?:string
}

interface MenuFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  checked?: boolean;

  subMenuId?: number
  enabled?: boolean
  codeAction?:string
  unique?:string

}




@Component({
    selector: 'app-user-customer-role-access',
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

  accesoMenus:AccesoMenu[]=[]

  cloneActions: any[]=[]
  actions:any[]=[]
  private transformer = (node: MenuNode, level: number) => {

    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      checked: node.checked,
      codeAction: node.codeAction,
      subMenuId: node.subMenuId,
      enabled:node.enabled,
      unique: node.unique
    };
  };

  treeControl = new FlatTreeControl<MenuFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<MenuNode, MenuFlatNode>(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  checklistSelection = new SelectionModel<MenuFlatNode>(true /* multiple */);

  getAccesses(){
    this.userCustomerRoleSvc.getAccesses(this.userRoleId()).subscribe(response=>{

      this.accesoMenus = response.menus;

      this.actions = structuredClone(response.actions)

      this.cloneActions = structuredClone(this.actions)
      let makeMenusNode = [{
         name: 'Todos',
         children: this.accesoMenus.map(m=>{
          let {subMenus, ...rest} = m;

          let nodeSubMenus = subMenus.map((item:any)=>{
            const {enabled, ...restSm} = item;


            let childrenActions = this.actions.map(a=>{
              let enabled = item.enabled && item.actions.some((aRaw:any)=>aRaw.code===a.codeAction) || false

              return {
                ...a,
                subMenuId: item.subMenuId,
                enabled
              }
            })

            return {
              ...restSm,
             // children: structuredClone(childrenActions)
            }
          })

           return {
             ...rest,
             children: nodeSubMenus
           }
         })
      }]

      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
       this.checklistSelection = new SelectionModel<MenuFlatNode>(true /* multiple */);
       this.dataSource.data = makeMenusNode;
       this.expandFirstLevelNodes();

      for (let node of this.treeControl.dataNodes) {
        // nivel 3 son las acciones


        if (!node.enabled) {
          continue;
        }

        this.todoItemSelectionToggle(node);
      }

    })
  }
  ngOnInit(){
    this.getAccesses()
  }

  hasChild = (_: number, node: MenuFlatNode) => node.expandable;

  todoItemSelectionToggle(node: MenuFlatNode): void {
    this.checklistSelection.toggle(node);
    this.toggleDescendantsSelection(node);
    this.checkAllParentsSelection(node);
  }

  toggleDescendantsSelection(node: MenuFlatNode): void {
    const descendants = this.treeControl?.getDescendants(node);
    descendants.forEach(child => {
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(child)
        : this.checklistSelection.deselect(child);
      this.toggleDescendantsSelection(child);
    });
  }

  checkAllParentsSelection(node: MenuFlatNode): void {
    let parent: MenuFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: MenuFlatNode): void {
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

  getParentNode(node: MenuFlatNode): MenuFlatNode | null {
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

  getLevel = (node: MenuFlatNode) => node.level;



  isNodeIndeterminate(node: MenuFlatNode): boolean {


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

/**  dataSubNode: any = {};
  onClickActions(node: MenuFlatNode){

    this.dataSubNode = node;
    for(let item of this.actions){
      item.checked = this.dataSubNode.actions.some((m:any)=>m.code===item.code)
    }
  }**/


 /** toggleAction(action:any){
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
  }**/

  /**actionHidden(){
    this.dataSubNode = {};
    this.actions = structuredClone(this.cloneActions)
  }**/



  successResponse = (response:any)=>{
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
        this.getAccesses()
      }
    }
  }

  onSave(){
    const checklistSelection = this.checklistSelection.selected;

    console.log(this.checklistSelection.selected)


    const filteredCheckedsLevel2 = this.treeControl.dataNodes.filter(ck=>ck.level===2);//Nivel submenus
    const filteredCheckedsLevel3 = checklistSelection.filter(ck=>ck.level===3);//Nivel acciones

    const mergeDuplicateLevel3 = filteredCheckedsLevel3.reduce((acc:any, curr:any)=>{

      let subMenuId = filteredCheckedsLevel2.find(l2=>l2.unique===curr.unique)?.subMenuId
      console.log(subMenuId)
      let existingNode  = acc.find((m:any)=>m.subMenuId===subMenuId);
      let action = this.actions.find(a=>a.codeAction===curr.codeAction)
      let {codeAction, ...restAction} =action;

      if(!existingNode ){

        acc.push({
          subMenuId,
          actions: [{...restAction, code: codeAction}]
        })
      }else{
        if(action){
          existingNode.actions.push({...restAction, code: codeAction})
        }
      }

      return acc;

    }, [])
    console.log(mergeDuplicateLevel3)

    let mappedLevel3 = mergeDuplicateLevel3.map((acc:any)=>({
      subMenuId: acc.subMenuId,
      actions: JSON.stringify(acc.actions)
    }))

    if(checklistSelection.length===0){
      this.tS.toastr({
        type: 'warning',
        message: 'Seleccione al menos un SubMenu'
      })
      return
    }



    if (mappedLevel3.some((s:any) => (s.actions?.length === 0))) {
      this.tS.toastr({
        type: 'warning',
        message: '¡Agregue al menos una acción de todos los submenús seleccionados!'
      });
      return;
    }

    Swal.fire({
      icon: 'warning',
      text: '¿Está seguro de actualizar los accesos de manera personalizada para el usuario seleccionado?',
      showCancelButton: true,
      showConfirmButton : true,
      cancelButtonText: 'No!',
      confirmButtonText: 'Si!'
    }).then(result=>{

        if(result.isConfirmed) {


          let data =   {
            accesses: JSON.stringify(mappedLevel3)
          }


          this.userCustomerRoleSvc.updateAcceses(this.userRoleId(), data).subscribe(this.successResponse)
        }



    })

  }


  async onDelete(){
    let {isConfirmed} = await  Swal.fire({
      icon: 'warning',
      html: '¿Está seguro de quitar los accesos personalizados? Esto restablecerá los permisos predeterminados.',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'No!',
      confirmButtonText: 'Si!'
    })

    if(!isConfirmed) return

    let data =   {
      accesses: null
    }
    this.userCustomerRoleSvc.updateAcceses(this.userRoleId(), data).subscribe(this.successResponse)

  }

}
