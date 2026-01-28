import { Component, ViewChild, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { ScheduleDialogComponent } from '@modules/seguridad/components/schedule-dialog/schedule-dialog.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';

@Component({
    selector: 'app-schedule-page',
    templateUrl: './schedule-page.component.html',
    styles: ``,
    imports: [BreadcrumbComponent, ScheduleListComponent]
})
export class SchedulePageComponent {
  @ViewChild(ScheduleListComponent) child!: ScheduleListComponent;
}
