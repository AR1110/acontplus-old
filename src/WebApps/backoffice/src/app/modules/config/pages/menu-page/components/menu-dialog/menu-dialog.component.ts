import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { MenuService } from '@modules/config/services/menu.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatHint, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { Menu } from '@modules/config/models/menu';
import { Aplicacion } from '@modules/config/models/aplicacion';
import { MatThemeButtonComponent } from 'acontplus-ui-components';
@Component({
  selector: 'app-menu-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatIcon,
    MatFormField,
    MatLabel,
    MatDialogActions,
    MatInput,
    MatSelect,
    MatOption,
    MatHint,
    MatError,
    MatThemeButtonComponent,
  ],
  templateUrl: './menu-dialog.component.html',
})
export class MenuDialogComponent implements OnInit {
  private menuService = inject(MenuService);
  private tS = inject(ToastrNotificationService);
  readonly data = inject<Menu>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<MenuDialogComponent>);

  menuForm: FormGroup;
  applications = signal<Aplicacion[]>([]);
  availableParentMenus = signal<Menu[]>([]);

  constructor(private fb: FormBuilder) {
    this.menuForm = this.fb.group({
      id: [null],
      aplicacionId: [null, Validators.required],
      name: ['', [Validators.required, Validators.maxLength(60)]],
      code: ['', [Validators.required, Validators.maxLength(5)]],
      icon: ['', Validators.maxLength(150)],
      url: ['', [Validators.required, Validators.maxLength(150)]],
      order: [0, Validators.min(0)],
      parentId: [null],
    });
  }

  ngOnInit(): void {
    // Load applications and available parent menus
    this.loadApplications();
    this.loadAvailableParentMenus();
    if (this.data.id > 0 && this.data) {
      this.menuForm.patchValue(this.data);
    }
  }

  loadApplications(): void {
    // Implement your service call to get applications
    this.menuService.get({ tipo: 2 }).subscribe((response) => {
      this.applications.set(response.applications);
    });
  }

  loadAvailableParentMenus(): void {
    // Implement your service call to get available parent menus
    // Filter out the current menu if editing to prevent circular references
    // this.menuService.getAvailableParentMenus(this.data.menu?.id).subscribe(menus => this.availableParentMenus = menus);
  }

  getMenuHierarchyName(menu: Menu): string {
    // Recursive function to build hierarchy name
    if (!menu.parentId) return menu.name;
    const parent = this.availableParentMenus().find(
      (m) => m.id === menu.parentId,
    );
    return parent
      ? `${this.getMenuHierarchyName(parent)} > ${menu.name}`
      : menu.name;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.menuForm.valid) {
      const menu: Menu = this.menuForm.value;
      if (menu.id > 0) {
        this.menuService.put(menu.id, menu).subscribe(this.commonResponse);
      } else {
        this.menuService.post(menu).subscribe(this.commonResponse);
      }
    } else {
      this.tS.show({
        type: 'warning',
        message: 'Por favor, complete todos los campos requeridos.',
      });
    }
  }
  commonResponse = (response: ApiResponse) => {
    if (response) {
      this.tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code == '1') {
        this.dialogRef.close(response);
      }
    }
  };
  // setOrder($event: any) {
  //   let aplicacionId = Number($event.target.value);
  //   let app = this.applications.find((x: any) => x.id === aplicacionId);
  //   this.menuForm.patchValue({ order: app.lastOrder });
  // }
}
