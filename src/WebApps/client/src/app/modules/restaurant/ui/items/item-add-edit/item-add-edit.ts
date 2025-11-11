import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { Button } from '@acontplus/ng-components';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { ItemSearch } from '@restaurant/ui/items/item-search/item-search';
import {ItemGetBydIdUseCase, ItemUpdateUseCase} from '@restaurant/application/use-cases/item.use-case';
import {
  GetProductSaleUseCase
} from '@inventory/product/application/use-cases/product/get-product.use-case';
import {ProductMeasure} from "@inventory/domain/models/product-measure";
import {ItemComposition} from "@restaurant/domain/models/item-composition";

@Component({
  selector: 'app-item-add-edit',
  imports: [
    ReactiveFormsModule,
    TabulatorComponent,
    Button,
    MatCustomDialogComponent,
    MatInputModule,
    ItemSearch,
  ],
  templateUrl: './item-add-edit.html',
  styles: ``,
})
export class ItemAddEdit implements OnInit {
  private itemGetByIdUseCase = inject(ItemGetBydIdUseCase);
  private productSaleUseCase = inject(GetProductSaleUseCase);
  private updateUseCase = inject(ItemUpdateUseCase)
  params = inject<{ id: number }>(MAT_DIALOG_DATA);
  itemForm = new FormGroup({
    id: new FormControl(0),
    summary: new FormControl('', [Validators.required]),
    recipe: new FormControl(''),
    instructions: new FormControl(''),
    cooking: new FormControl(false),
    productId: new FormControl(0),
    isActive: new FormControl(true),
  });
  itemCompositions = signal<ItemComposition[]>([]);
  #modalRef = inject(MatDialogRef<ItemAddEdit>);
  #tS = inject(ToastrNotificationService);

  selectExtend = (cell: any, onRendered: any, success: any, cancel: any) => {
    let medidas = [];
    const rows = cell.getRow().getData();

    if (rows.extents) {
      medidas = JSON.parse(rows.extents);
    }

    const selectList = document.createElement('select');
    selectList.style.width = '100%';
    selectList.style.boxSizing = 'border-box';

    onRendered(() => {
      selectList.focus();
      selectList.style.height = '100%';
    });

    const onChange = () => {
      if (selectList.selectedOptions[0].value != rows) {
        success(selectList.selectedOptions[0].value);

        cell.getElement().dataset.descripcion = selectList.selectedOptions[0].text;
        cell.getElement().dataset.extentId = selectList.selectedOptions[0].value;
      } else {
        cancel();
      }
    };

    selectList.addEventListener('blur', onChange);
    selectList.addEventListener('keydown', (e) => {
      if (e.keyCode == 13) {
        onChange();
      }
      if (e.keyCode == 27) {
        cancel();
      }
    });

    // Crear y añadir las opciones
    medidas.forEach((medida: any) => {
      const option = document.createElement('option');

      option.value = medida.idMedida.toString();
      option.text = medida.descripcion;

      if (medida.idMedida === rows.extentId) {
        option.selected = true;
      }
      selectList.appendChild(option);
    });

    return selectList;
  };

  formatterMedida = (cell: any) => {
    let medidas = [];
    const row = cell.getRow().getData();
    const value = cell.getValue();

    if (row.extents) {
      medidas = JSON.parse(row.extents);
    }

    if (medidas.length === 0) return '';
    return medidas.find((x: any) => x.idMedida == value)?.descripcion;
  };

  formatterCostPrice = (cell: any) => {
    let medidas = [];
    let value = 0;
    const row = cell.getRow().getData();

    if (row.extents !== undefined) {
      medidas = JSON.parse(row.extents);
    }

    medidas.forEach((e: any) => {
      if (e.idMedida == row.extentId) {
        value = e.precioCosto * row.quantity;
      }
    });
    return value.toFixed(2);
  };

  priceUpdate = (cell: any) => {
    const column = cell.getColumn()._column.field;
    const row = cell.getRow().getData();
    let medidas = [];

    if (row.extents !== undefined) {
      medidas = JSON.parse(row.extents);
    }

    if (column == 'extentId' && medidas.length > 0) {
      medidas.forEach((e: any) => {
        if (e.idMedida == row.extentId) {
          cell.getRow().update({
            precioCosto: e.precioCosto,
            costPrice: (e.precioCosto * row.quantity).toFixed(2),
          });
        }
      });
    }

    if (column == 'quantity' && medidas.length > 0) {
      medidas.forEach((e: any) => {
        if (e.idMedida == row.extentId) {
          cell.getRow().update({
            costPrice: (e.precioCosto * row.quantity).toFixed(2),
          });
        }
      });
    }
  };

  comboEditor = (cell: any, onRendered: any, success: any, cancel: any, editorParams: any) => {
    const column: any = cell.getColumn().getField();
    const data: any = cell.getData();
    // const oldValue = cell.getOldValue();
    // const value = cell.getValue();

    const editor: any = document.createElement('select');

    if (column === 'measureId') {
      for (const m of data.measures || []) {
        const opt = document.createElement('option');
        opt.value = m.measureId.toString();
        opt.innerHTML = m.name;
        editor.appendChild(opt);
      }
    }

    editor.style.padding = '3px';
    editor.style.width = '100%';
    editor.style.boxSizing = 'border-box';

    editor.value = Number(cell.getValue());

    onRendered(function () {
      editor.focus();
      editor.style.css = '100%';
    });

    function successFunc() {
      success(editor.value);
    }

    editor.addEventListener('change', successFunc);
    editor.addEventListener('blur', successFunc);

    return editor;
  };

  columns = [
    {
      title: 'Ingrediente',
      field: 'description',
      width: 450,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: 'Medida',
      field: 'measureId',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
      editor: this.comboEditor,
      formatter: function (cell: any) {
        const data = cell.getData();
        for (const m of data.measures ?? []) {
          if (m.measureId == cell.getValue()) {
            return m.name;
          }
        }
      },
      validator: 'required',
      width: '9px',
    },
    {
      title: 'Peso',
      field: 'weight',
      editor: true,
      width: 100,
      widthGrow: 1,
      validator: ['numeric'],
      value: '0',
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    // {
    //   title: 'Instrucciones',
    //   field: 'instructions',
    //   widthGrow: 3,
    //   width: 200,
    //   editor: true,
    // },
    {
      title: 'Cant.',
      field: 'quantity',
      width: 120,
      editor: true,
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
  //    cellEdited: this.priceUpdate,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: 'Precio costo',
      field: 'precioCosto',
      width: 120,
      editor: false,
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: 'Total',
      field: 'costPrice',
      width: 90,
      editor: true,
    //  formatter: this.formatterCostPrice,
      bottomCalc: (values: any, data: any, calcParams: any) => {
        let total = 0;
        data.forEach((e: any) => {
          total += Number(e.costPrice);
        });
        return total.toFixed(2);
      },
      hozAlign: 'center',
      headerSort: false,
      headerHozAlign: 'center',
    },
    {
      title: 'Acciones',
      widthGrow: 1,
      hozAlign: 'center',
      formatter: 'buttonCross',
      width: 100,
      headerSort: false,
      headerHozAlign: 'center',
      cellClick: function (e: any, cell: any) {
        cell.getRow().delete();
      },
    },
  ];
  rowDeleted(row: any) {
    const closeItemCompositions = JSON.parse(JSON.stringify(this.itemCompositions()));
    const data = row.getData();
    this.itemCompositions.set(closeItemCompositions.filter((x: any) => x.uuid !== data.uuid));
  }

  ngOnInit() {
     this.getItemById();
  }


  private getItemById(){
    this.itemGetByIdUseCase.execute(  this.params.id).subscribe((response) => {
      this.itemCompositions.set(response.itemCompositions);
      //this.itemForm.patchValue(response.item);
    });
  }



  onSelectItem(rowData: any) {
    this.productSaleUseCase.execute({
      id: rowData.productId
    }).subscribe((response) => {
      const {product, taxRates} = response;
      const measures:ProductMeasure[] = response.measures;
      const newRowData = new ItemComposition();

      const index = this.itemCompositions().findIndex(x => x.childItemId === rowData.id);
      const cloneItemCompositions = JSON.parse(JSON.stringify(this.itemCompositions()));

      if(index == -1){
        const defaultMeasure = measures.find(x => x.defaultMeasure);
        const dataTaxRate = taxRates.find((x:any) => x.code===product.codigoPorcentaje);
        if(!defaultMeasure){
          throw new Error('No se encontró medidas predeterminadas para el producto');
        }
        const defaultFee = defaultMeasure.fees.find(x => x.isDefault);

        if(!defaultFee){
          throw new Error('No se encontró tarifa predeterminada para el producto');
        }

        if(!dataTaxRate){
          throw new Error('No se encontró tipo impuesto para el producto');
        }

        cloneItemCompositions.push({
           ...newRowData,
          itemId: this.params.id,
          childItemId: rowData.id,
           productId: product.idArticulo,
           measures,
           measureId: defaultMeasure.measureId,
          feeId: defaultFee.id,
          description: product.descripcion,
           quantity: 1,
           costPrice: defaultMeasure.costPrice,
           weight: 0,
          taxRateId: dataTaxRate.id,
         })
      }
    this.itemCompositions.set(cloneItemCompositions);
    });
  }

  onSave() {
    if (this.itemForm.invalid) {
      return this.#tS.show({
        type: 'warning',
        message: 'Revise los datos ingresados',
      });
    }
    const dataToSave = {
      item: this.itemForm.value,
      itemCompositions: this.itemCompositions(),
    };
    this.updateUseCase.execute({
      id: this.params.id,
      data: dataToSave,
    }).subscribe((response) => {
      Swal.fire({
        icon: response.code === '1' ? 'success' : 'warning',
        html: response.message,
      });
      if (response.code === '1') {
        this.#modalRef.close(response);
      }
    });
  }



  onModalClose() {
    this.#modalRef.close();
  }


}
