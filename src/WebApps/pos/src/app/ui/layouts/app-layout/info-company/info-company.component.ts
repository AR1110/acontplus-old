import { MainStoreService } from '@/domain/services/main-store.service';
import { CustomContainerDialogComponent } from '@/ui/components/custom-container-dialog/custom-container-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
  constructor(public dialogRef: DialogRef<InfoCompanyComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
  private mainStore = inject(MainStoreService);

  estabs = computed(() => this.mainStore.state().establecimientos);
  puntosEmision = computed(() => this.mainStore.state().puntosEmision);
  bodegas = computed(() => this.mainStore.state().bodegas);
  data = model(this.mainStore.state());
}
