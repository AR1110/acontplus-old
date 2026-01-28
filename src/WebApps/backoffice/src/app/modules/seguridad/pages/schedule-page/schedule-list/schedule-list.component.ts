import { Component, inject, OnInit } from '@angular/core';

import { ToastrNotificationService } from 'acontplus-utils';

import { ScheduleDialogComponent } from '@modules/seguridad/components/schedule-dialog/schedule-dialog.component';
import { ScheduleService } from '@modules/seguridad/services/schedule.service';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AdvancedDialogService } from 'acontplus-ui-components';

@Component({
  selector: 'app-schedule-list',
  imports: [
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatIcon,
    MatMenuItem,
    MatCardContent,
    MatCard,
  ],
  templateUrl: './schedule-list.component.html',
  styles: ``,
})
export class ScheduleListComponent implements OnInit {
  private scheduleService = inject(ScheduleService);
  private advancedDialogService = inject(AdvancedDialogService);
  private tS = inject(ToastrNotificationService);

  schedules: any = [];

  ngOnInit() {
    this.get();
  }

  async onUpdate(schedule: any) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: ScheduleDialogComponent,
        title: 'Editar Horario',
        data: schedule,
      },
      {
        size: 'sm',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined) return;

      if (result['code'] == '1') {
        this.get();
      }
    });
  }

  setStatus(schedule: any) {
    schedule.isActive = !schedule.isActive;
    this.scheduleService.put(schedule.id, schedule).subscribe({
      next: (response) => {
        if (response) {
          if (response.code == '0') {
            this.tS.show({
              type: 'warning',
              message: response.message,
            });
            return;
          }
          this.tS.show({
            type: 'success',
            message: response.message,
          });
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {},
    });
  }

  get() {
    this.scheduleService.get({ tipo: 1 }).subscribe({
      next: (response) => {
        if (response) {
          if (response.code == '1') {
            let { schedules } = JSON.parse(response.payload as string);

            console.log(schedules);

            this.schedules = schedules || [];
          }
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {},
    });
  }

  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: ScheduleDialogComponent,
        title: 'Nuevo Horario',
        data: {},
      },
      {
        size: 'sm',
      },
    );

    dialogRef.afterClosed().subscribe((response) => {
      if (response == undefined) return;

      if (response.code == '1') {
        this.get();
      }
    });
  }
}
