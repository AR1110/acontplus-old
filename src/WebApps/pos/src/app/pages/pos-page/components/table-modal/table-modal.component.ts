import { CustomContainerDialogComponent } from '@/core/components/custom-container-dialog/custom-container-dialog.component';
import { playBeepSound } from '@/core/utils/sound.util';
import { ConfigService } from '@/services/config.service';
import { MainStoreService } from '@/store/main-store.service';
import { PosStoreService } from '@/store/pos-store.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-table-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CustomContainerDialogComponent
  ],
  templateUrl: './table-modal.component.html',
  styleUrl: './table-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableModalComponent {
  readonly dialogRef = inject(MatDialogRef<TableModalComponent>);
  private configSvc = inject(ConfigService)
  private mainStore = inject(MainStoreService)
  private posStore = inject(PosStoreService)

  selectedOption = computed(() => this.posStore.state().order.tableId)

  roomTables = signal<any>([])
  private floorColors: { [key: string]: string } = {};
  private colors: string[] = ['#FFB6C1', '#FFD700', '#87CEFA', '#98FB98'];

  // Obtener o asignar un color para un floorName
  getColorForFloor(floorName: string): string {
    if (!this.floorColors[floorName]) {
      this.floorColors[floorName] = this.colors[Object.keys(this.floorColors).length % this.colors.length];
    }
    return this.floorColors[floorName];
  }

  ngOnInit() {
    let params = {
      idEstablecimiento: this.mainStore.state().dataEstab.idEstablecimiento,
      codEstab: this.mainStore.state().dataEstab.codEstab
    }
    this.configSvc.getDataForm(params).subscribe(response => {
      this.roomTables.set(response.roomTables)
    })
  }

  selectOption(value: any, roomName: string) {
    if (value.assigned) {

    } else {
      this.posStore.state.update(e => {
        let tableId = 0;
        let tableDesc: string | null = null;
        if (this.selectedOption() !== value.id) {
          tableId = value.id;
          tableDesc = `${roomName}-${value.description}`;
        }

        let order = {
          ...e.order,
          tableId,
          tableDesc
        }
        playBeepSound();
        return {
          ...e,
          order
        }
      })
      this.dialogRef.close()
    }
  }

  toggleNode(node: any) {
    node.expanded = !node.expanded;
  }

  closeDialog() {
    this.dialogRef.close()
  }

}
