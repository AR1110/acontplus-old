import {Component, inject} from '@angular/core';
import {
  ListUserCustomerPermissionUseCase
} from "@modules/config/domain/use-cases/user-customer-permission/list-user-customer-permission.use-case";
import {UserCustomerStore} from "@modules/config/ui/store/user-customer.store";
import {  MatTableModule
} from "@angular/material/table";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {
  CreateUserCustomerPermissionUseCase
} from "@modules/config/domain/use-cases/user-customer-permission/create-user-customer-permission.use-case";
import {ApiResponse} from "@core/models/api-response";
import Swal from "sweetalert2";
import {UserCustomerPermission} from "@modules/config/domain/models/user-customer/user-customer-permission.model";
import {
  UpdateUserCustomerPermissionUseCase
} from "@modules/config/domain/use-cases/user-customer-permission/update-user-customer-permission.use-case";
import {getValidId} from "@core/utils/utils";
import {UserCustomerRole} from "@modules/config/domain/models/user-customer/user-customer-role.model";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";


@Component({
  selector: 'app-user-customer-permission',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggle,
    FormsModule,
    ThemeButtonComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-customer-permission.component.html',
  styles: `

    .mat-column-securityType  {
      width: 400px;
    }
  `
})
export class UserCustomerPermissionComponent {
  private $listUseCase = inject(ListUserCustomerPermissionUseCase)
  private $createUseCase = inject(CreateUserCustomerPermissionUseCase)
  private $updateUseCase = inject(UpdateUserCustomerPermissionUseCase)
  private $userCustomerStore =inject(UserCustomerStore)

  userPermissionData = {} as UserCustomerPermission;
  usersCustomerAdmin: UserCustomerRole[] = [];
  userCustomerAdminSelected = new FormControl([]);
  displayedColumns: string[] = ['index','name', 'status', 'securityType'];

  private transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      index: node.index,
      hasStatus: node.hasStatus,
      securityType: node.securityType,
      id: node.id,
      enabled: node.enabled,
      requiresKey: node.requiresKey,
    };
  }

  treeControl = new FlatTreeControl<any>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  hasChild = (_: number, node: any) => node.expandable;

    refresh(){
    this.getList()
  }

  private getList(){
    this.$listUseCase.execute({
      userRoleId: this.$userCustomerStore.userRoleId()
    }).subscribe(response=>{
      console.log(response)
      this.dataSource.data = response.userCustomPermissions;
      this.userPermissionData = response.userPermissionData;
      this.usersCustomerAdmin = response.usersCustomerAdmin;


    })
  }
  ngOnInit(){
    this.getList()
  }


  private successResponse = (response:ApiResponse)=>{
    if(response.code==="0"){
      Swal.fire({
        icon: 'warning',
        html: response.message,

      })
    }
    if(response.code==="1"){
      Swal.fire({
        icon: 'success',
        html: response.message,
        timer: 1000
      })
      this.getList()
    }
  }

  save(){
   const permissionsFiltered =  this.treeControl.dataNodes.filter(item=>item.level===1 && item.enabled)

   const permissionsData = permissionsFiltered.map((item:any)=>{
      return {
        userCustomPermissionId: item.id,
        enabled: item.enabled,
        requiresKey: item.requiresKey,

      }
    })
    // if(permissionsData.length===0){
    //   Swal.fire({
    //     icon: 'warning',
    //     html: 'Seleccione al menos una acción'
    //   })
    //   return
    // }

    const params = {
      userRoleId: this.$userCustomerStore.userRoleId(),
      permissionsData,
      id: this.userPermissionData.idUserPermission
    }

    if(getValidId(this.userPermissionData.idUserPermission)){
      this.$updateUseCase.execute(params).subscribe(this.successResponse)
    }

    if(!getValidId(this.userPermissionData.idUserPermission)){
      this.$createUseCase.execute(params).subscribe(this.successResponse)
    }


  }

}
