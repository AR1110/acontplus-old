import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  inject,
  input,
  KeyValueChangeRecord, KeyValueChanges,
  KeyValueDiffer,
  KeyValueDiffers,
  output
} from '@angular/core';
import {isObservable} from "rxjs";
import {DataGridUtils} from "@shared/utils/data-grid.util";
import {DataGridColumnButton} from "@shared/components/data-grid/types";
import {
  DataGridCellActionBadgePipe,
  DataGridCellActionDisablePipe,
  DataGridCellActionsPipe, DataGridCellActionTooltipPipe,
  DataGridCellSummaryPipe
} from "@shared/pipes/data-grid.pipe";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AcpToObservablePipe} from "@shared/pipes/to-observable.pipe";
import {AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgTemplateOutlet, PercentPipe} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBadgeModule} from "@angular/material/badge";
import {DataGridMenu} from "@shared/components/data-grid/data-grid-menu";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'acp-data-grid-cell',
  imports: [
    MatMenuModule,
    DataGridCellSummaryPipe,
    DataGridCellActionsPipe,
    MatIconButton,
    MatTooltipModule,
    MatBadgeModule,
    DataGridCellActionDisablePipe,
    DataGridCellActionTooltipPipe,
    AcpToObservablePipe,
    AsyncPipe,
    DataGridCellActionBadgePipe,
    MatIcon,
    DataGridMenu,
    MatButton,
    NgTemplateOutlet,
    MatChipListbox,
    MatChip,
    DecimalPipe,
    CurrencyPipe,
    PercentPipe,
    DatePipe
  ],
  templateUrl: './data-grid-cell.html',
  styleUrl: './data-grid-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridCell {
  private _utils = inject(DataGridUtils);
  private _differs = inject(KeyValueDiffers);
  private _changeDetectorRef = inject(ChangeDetectorRef);

   rowData = input<Record<string, any>>({})
   colDef = input<any>();


    summary = input(false);
   data = input<any[]>([]);


   placeholder = input('--');

   rowDataChange = output<KeyValueChangeRecord<string, any>>();

  private rowDataDiffer?: KeyValueDiffer<string, any>;

  rowChangeRecord?: KeyValueChangeRecord<string, any>;

  get _value() {
    return this._utils.getCellValue(this.rowData(), this.colDef());
  }

  ngOnInit(): void {
    this.rowDataDiffer = this._differs.find(this.rowData()).create();
  }

  ngDoCheck(): void {
    const changes = this.rowDataDiffer?.diff(this.rowData());
    if (changes) {
      this._applyChanges(changes);
    }
  }

  private _applyChanges(changes: KeyValueChanges<string, any>) {
    changes.forEachChangedItem(record => {
      this.rowChangeRecord = record;
      this.rowDataChange.emit(record);
      this._changeDetectorRef.markForCheck();
    });
  }

  _getText(value: any) {
    return value === undefined ? '' : this._utils.isEmpty(value) ? this.placeholder() : value;
  }

  _getTooltip(value: any) {
    return this._utils.isEmpty(value) ? '' : value;
  }

  _getFormatterTooltip(value: any) {
    return this._utils.isContainHTML(value) || this._utils.isEmpty(value) ? '' : value;
  }

  _onActionClick(event: MouseEvent, btn: DataGridColumnButton, rowData: Record<string, any>) {
    event.preventDefault();
    event.stopPropagation();

    if (typeof btn.pop === 'string' || isObservable(btn.pop)) {
     alert('')
    } else if (typeof btn.pop === 'object') {
       alert('objecg')
    } else {
      btn.click?.(rowData);
    }
  }
}
