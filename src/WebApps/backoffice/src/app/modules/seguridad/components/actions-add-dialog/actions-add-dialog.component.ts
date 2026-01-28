import { Component, inject, Input } from '@angular/core';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

import { ToastrNotificationService } from 'acontplus-utils';

import { LicenciaAccesoDetalleService } from '@modules/seguridad/services/licencia-acceso-detalle.service';

import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatThemeButtonComponent} from "acontplus-ui-components";

interface ActionSubMenu {
  name: string;
  completed: boolean;
  code: string;
  actions: ActionSubMenu[];
}

@Component({
  selector: 'app-actions-add-dialog',
  imports: [FormsModule, MatCheckbox, MatIcon, MatDialogActions, MatDialogContent, MatThemeButtonComponent],
  templateUrl: './actions-add-dialog.component.html',
  styles: `
    ul {
      list-style-type: none;
      margin-top: 4px;
    }
  `,
})
export class ActionsAddDialogComponent {
  @Input() params = {
    id: 0,
    menuId: 0, //menuId
    name: '',
    licenciaAccesoId: 0,
    order: 0,
  };

  private lincenciaAccesoSvc = inject(LicenciaAccesoDetalleService);
  private dialogRef = inject(MatDialogRef<ActionsAddDialogComponent>);
  private tS = inject(ToastrNotificationService);

  actionsSubMenu: ActionSubMenu = {
    name: 'Todos',
    completed: false,
    code: '',
    actions: [],
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete =
      this.actionsSubMenu.actions != null &&
      this.actionsSubMenu.actions.every((t) => t.completed);
  }

  someComplete(): boolean {
    if (this.actionsSubMenu.actions == null) {
      return false;
    }
    return (
      this.actionsSubMenu.actions.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.actionsSubMenu.actions == null) {
      return;
    }
    this.actionsSubMenu.actions.forEach((t) => (t.completed = completed));
  }

  getActionsBymenuId() {
    this.lincenciaAccesoSvc
      .getActionsBymenuId(this.params.id, this.params.menuId)
      .subscribe((response) => {
        this.actionsSubMenu.actions = response.actionsRawAndSelected;
        console.log(this.actionsSubMenu.actions);
      });
  }

  ngOnInit(): void {
    this.getActionsBymenuId();
  }

  save() {
    let selectedActions =
      this.actionsSubMenu.actions
        ?.filter((a) => a.completed)
        .map(({ code, name }) => ({ code, name })) ?? [];
    if (selectedActions.length == 0) {
      this.tS.show({
        type: 'warning',
        message: 'Debe Añadir al menos un permiso',
      });
      return;
    }

    let dataToSave = {
      licenciaAccesoId: this.params.licenciaAccesoId,
      order: this.params.order,
      menuId: this.params.menuId,
      actions: JSON.stringify(selectedActions),
    };
    this.lincenciaAccesoSvc
      .put(this.params.id, dataToSave)
      .subscribe((response) => {
        if (response) {
          this.tS.show({
            type: response.code == '1' ? 'success' : 'warning',
            message: response.message,
          });
          if (response.code == '1') {
            this.dialogRef.close(response);
          }
        }
      });
  }

  dialogClose() {
    this.dialogRef.close();
  }
}
