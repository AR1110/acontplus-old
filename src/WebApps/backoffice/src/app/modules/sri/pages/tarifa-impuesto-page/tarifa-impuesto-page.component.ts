import { Component, inject } from '@angular/core';
import { TarifaImpuestoService } from '@modules/sri/services/tarifa-impuesto.service';

import { TarifaImpuesto } from '@modules/sri/models/tarifa-impuesto';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { TarifaImpuestoDialogComponent } from '@modules/sri/pages/tarifa-impuesto-page/tarifa-impuesto-dialog/tarifa-impuesto-dialog.component';

import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  AdvancedDialogService,
  StatusDisplayPipe,
} from 'acontplus-ui-components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tarifa-impuesto-page',
  imports: [
    BreadcrumbComponent,

    MatButton,
    MatCardContent,
    MatCard,
    StatusDisplayPipe,
    MatIcon,
  ],
  templateUrl: './tarifa-impuesto-page.component.html',
  styles: ``,
})
export class TarifaImpuestoPageComponent {
  private readonly advancedDialogService = inject(AdvancedDialogService);
  private readonly tarifaImpuestoService = inject(TarifaImpuestoService);
  data: TarifaImpuesto = {
    idTarifaImpuesto: 0,
    codImpuesto: '',
    codigo: '',
    descripcion: '',
    porcentaje: 0,
    estado: false,
  };
  tarifas: TarifaImpuesto[] = [];

  async edit(item: TarifaImpuesto) {
    this.data = item;
    await this.openDialog();
  }

  get() {
    this.tarifaImpuestoService.get({ tipo: 1 }).subscribe((response) => {
      if (response && response.code === '1') {
        let { tarifas } = JSON.parse(response.payload as string);
        this.tarifas = tarifas;
      }
    });
  }

  ngOnInit(): void {
    this.get();
  }

  async openDialog() {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        component: TarifaImpuestoDialogComponent,
        title:
          this.data.idTarifaImpuesto > 0 ? 'Editar Tarifa' : 'Registrar Tarifa',
        data: this.data.idTarifaImpuesto > 0 ? this.data : {},
      },
      { size: 'lg' },
    );
    dialogRef.afterClosed().subscribe((response) => {
      if (response !== null && typeof response === 'object') {
        this.get();
      }
    });
    this.data = {} as TarifaImpuesto;
  }
}
