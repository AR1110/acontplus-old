import { Component, inject } from '@angular/core';
import { LicenciaAccesoDetalleService } from '@modules/seguridad/services/licencia-acceso-detalle.service';
import { ActionsAddDialogComponent } from '@modules/seguridad/components/actions-add-dialog/actions-add-dialog.component';
import Swal from 'sweetalert2';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  AdvancedDialogService,
  MatThemeButtonComponent,
} from 'acontplus-ui-components';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-actions-access-dialog',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIcon,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './actions-access-dialog.component.html',
  styles: ``,
})
export class ActionsAccessDialogComponent {
  private ladService = inject(LicenciaAccesoDetalleService);
  private dialogRef = inject(MatDialogRef<ActionsAddDialogComponent>);
  private advancedDialogService = inject(AdvancedDialogService);
  private tS = inject(ToastrNotificationService);

  data: any = {};
  menus: any = [];
  submenus: any = [];
  submenusAccordion: any = [];

  async onActionsOpen(item: any) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: ActionsAddDialogComponent,
        title: item.id > 0 ? 'Editar Acceso' : 'Agregar Acceso',
        data:
          item.id > 0
            ? item
            : { licenciaAccesoId: this.data.id, menuId: item.id },
      },
      {
        size: 'lg',
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.get();
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  filterSubmenusAccordion(menuId: number) {
    this.submenusAccordion =
      this.submenus.filter((x: { menuId: number }) => x.menuId == menuId) || [];
  }

  get() {
    this.ladService
      .get({ licenciaAccesoId: this.data.id })
      .subscribe((response) => {
        if (response) {
          let { menus, submenus } = JSON.parse(response.payload as string);
          this.menus = menus;
          this.submenus = submenus;
        }
      });
  }

  ngOnInit(): void {
    this.get();
  }

  askToDelete(item: any) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      html: `Esta seguro de eliminar el submenu <b>${item.name}</b> de manera permanente?`,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
    }).then((response) => {
      if (response.isConfirmed) {
        this.ladService.delete(item.id).subscribe((response) => {
          if (response) {
            this.tS.show({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code == '1') {
              let submenusNoRemoved = this.submenusAccordion.filter(
                (x: { id: number }) => x.id !== item.id,
              );
              this.submenusAccordion = submenusNoRemoved;
            }
          }
        });
      }
    });
  }
}
