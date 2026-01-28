import {Component, Input, input, SimpleChanges} from '@angular/core';
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";

import {FormsModule} from "@angular/forms";
import { ActionSubMenu, MainNodeAction} from "@modules/seguridad/domain/models/action.model";

@Component({
    selector: 'app-menu-action',
    imports: [MatCheckboxModule, FormsModule],
    templateUrl: './sub-menu-action.component.html',
    styles: `
    .checkbox-section {
      margin: 12px 0;
    }
    .checkbox-margin {
      margin: 0 12px;
    }
    ul {
      list-style-type: none;
      margin-top: 4px;
    }
  `
})
export class SubMenuActionComponent {
  @Input({required: true}) actions:ActionSubMenu[]  = []


  mainNodeAction: MainNodeAction = {
    name: 'Todos',
    completed: false,
    actions:[] ,
  };

  allComplete: boolean = false;

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes["actions"]){
      this.mainNodeAction.actions = this.actions;

    }
  }

  updateAllComplete() {
    this.allComplete = this.mainNodeAction.actions != null && this.mainNodeAction.actions.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.mainNodeAction.actions == null) {
      return false;
    }
    return this.mainNodeAction.actions.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.mainNodeAction.actions == null) {
      return;
    }
    this.mainNodeAction.actions.forEach(t => (t.completed = completed));
  }
}
