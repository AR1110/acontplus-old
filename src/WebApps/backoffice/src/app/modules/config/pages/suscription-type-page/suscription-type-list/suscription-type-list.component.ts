import { Component, inject } from '@angular/core';

import { ToastrNotificationService } from 'acontplus-utils';

import { SuscriptionTypeService } from '@modules/sales/services/suscription-type.service';
import { SuscriptionTypeDialogComponent } from '@modules/config/pages/suscription-type-page/suscription-type-dialog/suscription-type-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AdvancedDialogService } from 'acontplus-ui-components';

@Component({
  selector: 'app-suscription-type-list',
  imports: [
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './suscription-type-list.component.html',
  styles: ``,
})
export class SuscriptionTypeListComponent {
  private suscriptionTypeService = inject(SuscriptionTypeService);
  private advancedDialogService = inject(AdvancedDialogService);
  private tS = inject(ToastrNotificationService);
  susctipcionTypes: any = [];

  ngOnInit() {
    this.get();
  }

  get() {
    this.suscriptionTypeService.get().subscribe({
      next: (response) => {
        if (response) {
          if (response.code == '1') {
            this.susctipcionTypes = response.payload;
          }
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {},
    });
  }

  async onUpdate(schedule: any) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: SuscriptionTypeDialogComponent,
        title: 'Editar Tipo de Suscripción',
        data: schedule,
      },
      {
        size: 'lg',
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
    this.suscriptionTypeService.put(schedule.id, schedule).subscribe({
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

  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: SuscriptionTypeDialogComponent,
        title: 'Nuevo Tipo de Suscripción',
        data: null, // No data needed for new subscription type
      },
      {
        size: 'lg',
      },
    );

    dialogRef.afterClosed().subscribe((response) => {
      if (response.code == '1') {
        this.get();
      }
    });
  }
}
