
import { CustomContainerDialogComponent } from '@/ui/components/custom-container-dialog/custom-container-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {LayoutStore} from "@ui/store/layout.store";

@Component({
  selector: 'app-info-company',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    CustomContainerDialogComponent,
  ],
  templateUrl: './info-company.component.html',
})
export class InfoCompanyComponent {
  private $layoutStore = inject(LayoutStore)
   public dialogRef = inject(DialogRef<InfoCompanyComponent>)

  estabs = computed(() => this.$layoutStore.establecimientos());
  puntosEmision = computed(() => this.$layoutStore.puntosEmision());
  bodegas = computed(() => this.$layoutStore.bodegas());
  data = computed(()=>{
    return {
      estabId: this.$layoutStore.establecimientoId(),
      puntoEmisionId: this.$layoutStore.puntoEmisionId(),
      bodegaId: this.$layoutStore.bodegaId()
    }
  });
  close(): void {
    this.dialogRef.close();
  }
}
