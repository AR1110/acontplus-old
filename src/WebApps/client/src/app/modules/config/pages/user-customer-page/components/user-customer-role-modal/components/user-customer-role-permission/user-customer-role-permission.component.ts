import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";

export interface Task {
  name: string;
  completed: boolean;
  color: any
  subtasks?: Task[];
}

@Component({
  selector: 'app-user-customer-role-permission',
  standalone: true,
  imports: [MatCheckboxModule, FormsModule],
  templateUrl: './user-customer-role-permission.component.html',
  styles: `.example-section {
  margin: 12px 0;
}

.example-margin {
  margin: 0 12px;
}

ul {
  list-style-type: none;
  margin-top: 4px;
}`
})
export class UserCustomerRolePermissionComponent {

  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Primary', completed: false, color: 'primary' },
      { name: 'Accent', completed: false, color: 'accent' },
      { name: 'Warn', completed: false, color: 'warn' },
    ],
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

}
