
import { CustomContainerDialogComponent } from '@/shared/components/custom-container-dialog/custom-container-dialog.component';
import { playBeepSound } from '@/shared/utils/sound.util';
import { ActionOrderDialogDirective } from '@/shared/directives/action-order-dialog.directive';
import { ConfigService } from '@/shared/services/config.service';
import { TableService } from '@/features/pos/services/table.service';
import { MainStoreService } from '@/store/main-store.service';
import { PosStoreService } from '@/features/pos/store/pos-store.service';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-table-modal',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        OverlayscrollbarsModule,
        CustomContainerDialogComponent,
        ActionOrderDialogDirective
    ],
    templateUrl: './table-modal.component.html',
    styleUrl: './table-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableModalComponent {

  readonly panelOpenState = signal(false);

  constructor(public dialogRef: DialogRef<TableModalComponent>) { }

  close(): void {
    this.dialogRef.close();
  }



 // readonly dialogRef = inject(MatDialogRef<TableModalComponent>);
  private configSvc = inject(ConfigService)
  private mainStore = inject(MainStoreService)
  private posStore = inject(PosStoreService)
  private tableSvc = inject(TableService)
  private tS = inject(ToastrService)

  selectedOption = computed(() => this.posStore.state().order.tableId)

  roomTables = signal<any>([]);
  tableId = signal(0)
  private floorColors: { [key: string]: string } = {};
  private lightColors: string[] = ['#FFB6C1', '#FFD700', '#87CEFA', '#98FB98'];
  private darkColors: string[] = ['#FF69B4', '#FFA500', '#00BFFF', '#32CD32'];

  getColorForFloor(floorName: string): string {
    if (!this.floorColors[floorName]) {
      const currentThemeColors = this.getCurrentThemeColors();
      this.floorColors[floorName] = currentThemeColors[Object.keys(this.floorColors).length % currentThemeColors.length];
    }
    return this.floorColors[floorName];
  }

  private getCurrentThemeColors(): string[] {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? this.darkColors : this.lightColors;
  }

  private getDataForm() {
    let params = {
      idEstablecimiento: this.mainStore.state().dataEstab.idEstablecimiento,
      codEstab: this.mainStore.state().dataEstab.codEstab
    }
    this.configSvc.getDataForm(params).subscribe(response => {
      this.roomTables.set(response.roomTables.map(item=>{
        return {
          ...item,
          expanded: true
         // expanded: item.tables.some((tb:any)=>(tb.id===this.selectedOption() || tb.id === this.tableId()))
        }
      }))
    })
  }

  ngOnInit() {
    this.getDataForm()
  }

  selectOption(value: any, roomName: string) {
    this.tableId.set(value.id);
    if (value.assigned) {
      this.tableSvc.unassign(value.id).subscribe(res => {
        if (res.code === "0") {
          this.tS.warning(res.message)
        }
        if (res.code === "1") {
          playBeepSound();
          this.tS.success(res.message);
          this.getDataForm()

        }
      })


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
