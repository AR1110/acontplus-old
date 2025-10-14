import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

interface SubFamilia {
  idSubFamilia: number;
  subFamilia: string;
}

interface Familia {
  familia: string;
  subFamilias: SubFamilia[];
}

@Component({
  selector: 'app-warehouse-transfer-filter-advanced',
  imports: [
    MatSelectModule,
    MatInput,
    MatCustomDialogComponent,
    ReactiveFormsModule
  ],
  templateUrl: './warehouse-transfer-filter-advanced.html',
  styleUrl: './warehouse-transfer-filter-advanced.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseTransferFilterAdvanced {
  private dgRef = inject(MatDialogRef<WarehouseTransferFilterAdvanced>);
  private params = inject(MAT_DIALOG_DATA);

  checkedSubCategorias = new FormControl<(number | string)[]>([]);
  subCategorias: Familia[] = [];
  allValue = 'SELECT_ALL';

  ngOnInit() {
    // Datos de ejemplo
    this.subCategorias = [
      {
        familia: 'COMBOS',
        subFamilias: [
          { idSubFamilia: 1, subFamilia: 'COMBO2' },
          { idSubFamilia: 2, subFamilia: 'COMBO1' }
        ]
      },
      {
        familia: 'INGREDIENTES',
        subFamilias: [
          { idSubFamilia: 3, subFamilia: 'VEGETALES' }
        ]
      }
    ];
  }

  toggleSelectAll(event: any) {
    if (event.isUserInput) {
      if (event.source.selected) {
        // Seleccionar todo
        const allIds = this.getAllSubfamiliaIds();
        const allGroups = this.subCategorias.map(f => 'GROUP_' + f.familia);
        this.checkedSubCategorias.setValue([this.allValue, ...allGroups, ...allIds], { emitEvent: false });
      } else {
        // Deseleccionar todo
        this.checkedSubCategorias.setValue([], { emitEvent: false });
      }
    }
  }

  toggleGroup(event: any, familia: Familia) {
    if (event.isUserInput) {
      const currentValue = this.checkedSubCategorias.value || [];
      const groupKey = 'GROUP_' + familia.familia;
      const groupIds = familia.subFamilias.map(sf => sf.idSubFamilia);

      if (event.source.selected) {
        // Seleccionar grupo - agregar todas las subfamilias
        const newValue = [...currentValue];
        groupIds.forEach(id => {
          if (!newValue.includes(id)) {
            newValue.push(id);
          }
        });
        this.checkedSubCategorias.setValue(newValue, { emitEvent: false });
        this.checkIfAllSelected();
      } else {
        // Deseleccionar grupo - quitar todas las subfamilias
        const newValue = currentValue.filter(
          val => !groupIds.includes(val as number) && val !== groupKey
        );
        // Quitar "Seleccionar todo" también
        const finalValue = newValue.filter(v => v !== this.allValue);
        this.checkedSubCategorias.setValue(finalValue, { emitEvent: false });
      }
    }
  }

  onSelectionChange(event: any) {
    const selected = this.checkedSubCategorias.value || [];

    // Actualizar checkboxes de grupos basado en subfamilias seleccionadas
    this.updateGroupCheckboxes();
    this.checkIfAllSelected();
  }

  private updateGroupCheckboxes() {
    const selected = this.checkedSubCategorias.value || [];
    const newValue = [...selected];
    let changed = false;

    this.subCategorias.forEach(familia => {
      const groupKey = 'GROUP_' + familia.familia;
      const groupIds = familia.subFamilias.map(sf => sf.idSubFamilia);
      const allGroupSelected = groupIds.every(id => selected.includes(id));
      const someGroupSelected = groupIds.some(id => selected.includes(id));

      if (allGroupSelected && !selected.includes(groupKey)) {
        newValue.push(groupKey);
        changed = true;
      } else if (!someGroupSelected && selected.includes(groupKey)) {
        const index = newValue.indexOf(groupKey);
        if (index > -1) {
          newValue.splice(index, 1);
          changed = true;
        }
      }
    });

    if (changed) {
      this.checkedSubCategorias.setValue(newValue, { emitEvent: false });
    }
  }

  private checkIfAllSelected() {
    const selected = this.checkedSubCategorias.value || [];
    const allIds = this.getAllSubfamiliaIds();
    const allSelected = allIds.every(id => selected.includes(id));

    if (allSelected && !selected.includes(this.allValue)) {
      this.checkedSubCategorias.setValue([...selected, this.allValue], { emitEvent: false });
    } else if (!allSelected && selected.includes(this.allValue)) {
      const newValue = selected.filter(v => v !== this.allValue);
      this.checkedSubCategorias.setValue(newValue, { emitEvent: false });
    }
  }

  private getAllSubfamiliaIds(): number[] {
    return this.subCategorias.flatMap(f =>
      f.subFamilias.map(sf => sf.idSubFamilia)
    );
  }

  getDisplayValue(): string {
    const selected = this.checkedSubCategorias.value || [];

    // Filtrar solo los IDs numéricos (subfamilias reales)
    const subfamiliaIds = selected.filter(val => typeof val === 'number') as number[];

    if (subfamiliaIds.length === 0) {
      return '';
    }

    // Obtener los nombres de las subfamilias seleccionadas
    const nombres: string[] = [];
    this.subCategorias.forEach(familia => {
      familia.subFamilias.forEach(sf => {
        if (subfamiliaIds.includes(sf.idSubFamilia)) {
          nombres.push(sf.subFamilia);
        }
      });
    });

    return nombres.join(', ');
  }

  close() {
    console.log(this.checkedSubCategorias);
 //   this.dgRef.close();
  }

}
