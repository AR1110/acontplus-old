import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { ReleaseDialogComponent } from '@modules/common/pages/release-page/release-dialog/release-dialog.component';
import { ReleaseService } from '@modules/common/services/release.service';
import { Release } from '@modules/common/models/release.model';

import Swal from 'sweetalert2';
import { ToastrNotificationService } from 'acontplus-utils';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AdvancedDialogService } from 'acontplus-ui-components';

@Component({
  selector: 'app-release-page',
  imports: [
    BreadcrumbComponent,

    MatButton,
    MatMenuItem,
    MatMenu,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatCardContent,
    MatCard,
  ],
  templateUrl: './release-page.component.html',
  styles: ``,
})
export class ReleasePageComponent {
  private readonly advancedDialogService = inject(AdvancedDialogService);
  private readonly releaseService = inject(ReleaseService);
  private readonly tS = inject(ToastrNotificationService);
  data = {} as Release;
  releases: Release[] = [];

  loadReleases() {
    this.releaseService.get({}).subscribe((response) => {
      if (response) {
        this.releases = (response.payload as Release[]) || [];
      }
    });
  }

  ngOnInit(): void {
    this.loadReleases();
  }

  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: ReleaseDialogComponent,
        title: this.data.id > 0 ? 'Editar Lanzamiento' : 'Nuevo Lanzamiento',
        data: this.data,
      },
      {
        size: 'xl',
      },
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (response !== null && typeof response !== 'undefined') {
        this.loadReleases();
      }
      if (this.data.id > 0) {
        this.data = {} as Release;
      }
    });
  }

  async onEdit(item: Release) {
    this.data = item;
    await this.openDialog();
  }

  onDelete(item: Release) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia!',
      text: 'Esta seguro de eliminar este lanzamiento',
      allowOutsideClick: false,
      confirmButtonText: 'Si',
      showDenyButton: true,
      denyButtonText: 'No',
    }).then((response) => {
      if (response.isConfirmed) {
        this.releaseService.delete(item.id).subscribe((response) => {
          if (response) {
            this.tS.show({
              type: response.code == '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code === '1') {
              this.loadReleases();
            }
          }
        });
      }
    });
  }
}
