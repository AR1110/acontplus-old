import {Component, inject, ViewChild} from '@angular/core';
import {MatTree, MatTreeFlatDataSource, MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SelectionModel} from "@angular/cdk/collections";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {
  ListAccessUserCustomerRoleUseCase
} from "@modules/config/domain/use-cases/user-customer-role/list-access-user-customer-role.use-case";
import {
  UpdateAccessUserCustomerRoleUseCase
} from "@modules/config/domain/use-cases/user-customer-role/update-access-user-customer-role.use-case";
import {UserCustomerStore} from "@modules/config/ui/store/user-customer.store";
import {isApiResponse} from "@core/models/api-response";
import Swal from "sweetalert2";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}
@Component({
  selector: 'app-user-customer-access',
  imports: [
    MatTreeModule,
    MatCheckboxModule,
    MatIcon,
    MatButtonModule,
    ThemeButtonComponent
  ],
  templateUrl: './user-customer-access.component.html',
  styleUrls: ['./user-customer-access.component.scss']
})
export class UserCustomerAccessComponent {
  @ViewChild('tree') tree!: MatTree<TreeNode>;

  dataSource = new MatTreeNestedDataSource<TreeNode>();
  checklistSelection = new SelectionModel<TreeNode>(true /* multiple */);
  private $listAccessUseCase = inject(ListAccessUserCustomerRoleUseCase)
  private $updateAccessUseCase = inject(UpdateAccessUserCustomerRoleUseCase)
  private $userCustomerStore = inject(UserCustomerStore);

  childrenAccessor = (node: TreeNode) => node.children||[];



  getAccesses(){
    this.$listAccessUseCase.execute({
      userRoleId: this.$userCustomerStore.userRoleId()
    }).subscribe(response=>{

    //  this.accesoMenus = response.menus;

     // this.actions = structuredClone(response.actions)

    //  this.cloneActions = structuredClone(this.actions)
      const makeMenusNode = [{
        name: 'Todos',
        children: response.menus.map((m:any)=>{
          let {subMenus, ...rest} = m;

          let nodeSubMenus = subMenus.map((item:any)=>{
            const {enabled, ...restSm} = item;


            let childrenActions = response.actions.map((a:any)=>{
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

      this.dataSource.data = makeMenusNode;

    })
  }
  ngOnInit(){
    this.getAccesses()
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  // IMPORTANT: Add stopPropagation to prevent click event bubbling
  // This prevents matTreeNodeToggle from getting triggered when clicking checkbox
  onCheckboxClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  getDescendants(node: TreeNode): TreeNode[] {
    const descendants: TreeNode[] = [];

    const addDescendants = (currentNode: TreeNode) => {
      if (currentNode.children) {
        currentNode.children.forEach(child => {
          descendants.push(child);
          addDescendants(child);
        });
      }
    };

    addDescendants(node);
    return descendants;
  }

  descendantsAllSelected(node: TreeNode): boolean {
    const descendants = this.getDescendants(node);
    return descendants.length > 0 &&
      descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: TreeNode): boolean {
    const descendants = this.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  itemSelectionToggle(node: TreeNode, event: any): void {
    // Stop event propagation to prevent node toggle
    // event.stopPropagation();

    this.checklistSelection.toggle(node);
    const descendants = this.getDescendants(node);

    if (this.checklistSelection.isSelected(node)) {
      this.checklistSelection.select(...descendants);
    } else {
      this.checklistSelection.deselect(...descendants);
    }

    this.checkAllParentsSelection(node);
  }

  leafItemSelectionToggle(node: TreeNode, event: any): void {
    // Stop event propagation
    // event.stopPropagation();

    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: TreeNode): void {
    let parent = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TreeNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.getDescendants(node);
    const descAllSelected = descendants.length > 0 &&
      descendants.every(child => this.checklistSelection.isSelected(child));

    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: TreeNode): TreeNode | null {
    const findParent = (nodes: TreeNode[], target: TreeNode): TreeNode | null => {
      for (const current of nodes) {
        if (current.children && current.children.includes(target)) {
          return current;
        }
        if (current.children) {
          const result = findParent(current.children, target);
          if (result) return result;
        }
      }
      return null;
    };

    return findParent(this.dataSource.data, node);
  }



  successResponse = (response:any)=>{
    if (isApiResponse(response)) {
      if (response.code === "0") {
        Swal.fire({
          icon: 'warning',
          html: response.message
        })
      }
      if (response.code === "1") {
        Swal.fire({
          icon: 'success',
          html: response.message,
          timer: 1000
        })
        this.getAccesses()
      }
    }
  }

  onSave(){
    // const checklistSelection = this.checklistSelection.selected;
    //
    //
    // const filteredCheckedsLevel2 = this.treeControl.dataNodes.filter(ck=>ck.level===2);//Nivel submenus
    // const filteredCheckedsLevel3 = checklistSelection.filter(ck=>ck.level===3);//Nivel acciones
    //
    // const mergeDuplicateLevel3 = filteredCheckedsLevel3.reduce((acc:any, curr:any)=>{
    //
    //   let subMenuId = filteredCheckedsLevel2.find(l2=>l2.unique===curr.unique)?.subMenuId
    //
    //   let existingNode  = acc.find((m:any)=>m.subMenuId===subMenuId);
    //   let action = this.actions.find(a=>a.codeAction===curr.codeAction)
    //   let {codeAction, ...restAction} =action;
    //
    //   if(!existingNode ){
    //
    //     acc.push({
    //       subMenuId,
    //       actions: [{...restAction, code: codeAction}]
    //     })
    //   }else{
    //     if(action){
    //       existingNode.actions.push({...restAction, code: codeAction})
    //     }
    //   }
    //
    //   return acc;
    //
    // }, [])
    //
    // let mappedLevel3 = mergeDuplicateLevel3.map((acc:any)=>({
    //   subMenuId: acc.subMenuId,
    //   actions: JSON.stringify(acc.actions)
    // }))
    //
    // if(checklistSelection.length===0){
    //   Swal.fire({
    //     icon: 'warning',
    //     text: 'Seleccione al menos un SubMenu'
    //   })
    //   return
    // }
    //
    //
    //
    // if (mappedLevel3.some((s:any) => (s.actions?.length === 0))) {
    //   Swal.fire({
    //     icon: 'warning',
    //     text:'Agregue al menos una acción de todos los submenús seleccionados'
    //   })
    //   return;
    // }

    Swal.fire({
      icon: 'warning',
      text: '¿Está seguro de actualizar los accesos de manera personalizada para el usuario seleccionado?',
      showCancelButton: true,
      showConfirmButton : true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then(result=>{

      if(result.isConfirmed) {
        let data =   {
          accesses: JSON.stringify([])
        }

        const params = {
          data,
          userRoleId: this.$userCustomerStore.userRoleId()
        }

        this.$updateAccessUseCase.execute(params).subscribe(this.successResponse)
      }



    })

  }


  async onDelete(){
    let {isConfirmed} = await  Swal.fire({
      icon: 'warning',
      html: '¿Está seguro de quitar los accesos personalizados? Esto restablecerá los permisos predeterminados.',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    })

    if(!isConfirmed) return

    let data =   {
      accesses: null
    }
    const params = {
      data,
      userRoleId: this.$userCustomerStore.userRoleId()
    }

    this.$updateAccessUseCase.execute(params).subscribe(this.successResponse)

  }



}
