import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { LicenseType } from '@modules/config/models/license-type';
import { LicenseTypeService } from '@modules/config/services/license-type.service';
import { LicenseTypeDialogComponent } from '@modules/config/pages/license-type-page/license-type-dialog/license-type-dialog.component';

import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AdvancedDialogService } from 'acontplus-ui-components';

@Component({
  selector: 'app-license-type-page',
  imports: [BreadcrumbComponent, MatButton, MatCard, MatCardContent, MatIcon],
  templateUrl: './license-type-page.component.html',
  styles: ``,
})
export class LicenseTypePageComponent {
  private licenseTypeService = inject(LicenseTypeService);
  private advancedDialogService = inject(AdvancedDialogService);
  licenseTypes: LicenseType[] = [];
  itemSelected: LicenseType = {
    id: 0,
    code: '',
    name: '',
  };
  async edit(item: LicenseType) {
    this.itemSelected = item;
    await this.openDialog(2);
  }
  get() {
    this.licenseTypeService.get({}).subscribe({
      next: (response) => {
        if (response) {
          if (response.code == '1') {
            this.licenseTypes = (response.payload as LicenseType[]) || [];
          }
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {},
    });
  }
  ngOnInit(): void {
    this.get();
  }
  async openDialog(tipo: number) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: LicenseTypeDialogComponent,
        title: tipo == 1 ? 'Nuevo Tipo de Licencia' : 'Editar Tipo de Licencia',
        data: tipo == 1 ? {} : this.itemSelected,
      },
      {
        size: 'sm',
      },
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (response !== null && typeof response == 'object') {
        console.log('inside');
        this.get();
      }
    });
  }
}
