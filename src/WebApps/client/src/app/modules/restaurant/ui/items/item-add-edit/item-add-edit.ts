import {Component, computed, inject, OnInit, signal} from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { Recipe } from '@restaurant/domain/models/recipe.model';

import { IngredientSearchComponent } from '@restaurant/ui/ingredient/ingredient-search/ingredient-search.component';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { IngredientService } from '@restaurant/data/services/ingredient.service';
import { RecipeService } from '@restaurant/data/services/recipe.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';
import { ItemService } from '@restaurant/data/services/item.service';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import {ItemSearch} from "@restaurant/ui/items/item-search/item-search";
import {ItemGetBydIdUseCase} from "@restaurant/application/use-cases/item.use-case";
import {ProductGetIdUseCase} from "@inventory/product/application/use-cases/product/get-product.use-case";

@Component({
  selector: 'app-item-add-edit',
  imports: [
    ReactiveFormsModule,
    TabulatorComponent,
    IngredientSearchComponent,
    ThemeButtonComponent,
    MatCustomDialogComponent,
    MatInputModule,
    ItemSearch,
  ],
  templateUrl: './item-add-edit.html',
  styles: ``,
})
export class ItemAddEdit implements OnInit {
  private itemGetByIdUseCase = inject(ItemGetBydIdUseCase);
  private productGetIdUseCase = inject(ProductGetIdUseCase)
  data = inject<{id: number}>(MAT_DIALOG_DATA);
  itemForm = new FormGroup({
    id: new FormControl(0),
    summary: new FormControl('', [Validators.required]),
    recipe: new FormControl(''),
    instructions: new FormControl(''),
    cooking: new FormControl(false),
    productId: new FormControl(0),
  });
  recipes = signal<Recipe[]>([]);
  #ingredientService = inject(IngredientService);
  #itemService = inject(ItemService);
  #modalRef = inject(MatDialogRef<ItemAddEdit>);
  #recipeService = inject(RecipeService);
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
      for (const m of (data.measures || [])) {
        const opt = document.createElement('option');
        opt.value = m.idMedida.toString();
        opt.innerHTML = m.descripcion;
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
      field: 'summary',
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
        for (const m of (data.measures ?? [])) {
          if (m.idMedida == cell.getValue()) {
            return m.descripcion;
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
      cellEdited: this.priceUpdate,
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
      formatter: this.formatterCostPrice,
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
    const closeRecipes = JSON.parse(JSON.stringify(this.recipes()));
    const data = row.getData();
    console.log(data);

    this.recipes.set(closeRecipes.filter((x: any) => x.uuid !== data.uuid));
  }

  getRecipes() {
    this.#recipeService.getByItem(this.data.id).subscribe((response) => {
      this.recipes.set(response.recipes);
    });
  }

  ngOnInit() {
    if (this.data.id > 0) {
     // this.getRecipes();
      this.itemForm.patchValue(this.data);
    }
  }

  onModalClose() {
    this.#modalRef.close();
  }

  onSave() {
    if (this.itemForm.invalid) {
      return this.#tS.show({
        type: 'warning',
        message: 'Revise los datos ingresados',
      });
    }
    const dataToSave = {
      itemJson: this.itemForm.value,
      recipeJson: this.recipes(),
    };
    this.#itemService.put(this.data.id, { data: dataToSave }).subscribe((response) => {
      Swal.fire({
        icon: response.code === '1' ? 'success' : 'warning',
        html: response.message,
      });
      if (response.code === '1') {
        this.#modalRef.close(response);
      }
    });
  }

  onSelectItem(rowData:any){
    this.productGetIdUseCase.execute(rowData.productId).subscribe((response) => {
      console.log(response);
    })
    console.log(rowData);
    const cloneRecipes = JSON.parse(JSON.stringify(this.recipes()));

    cloneRecipes.push(rowData)
    this.recipes.set(cloneRecipes)
  }

  onIngredientSelected($event: Ingredient) {
    const productId = Number($event.productId);

    this.#ingredientService.get({ productId, tipo: 3 }).subscribe((response) => {
      const extents = response.extents;

      const cloneRecipes = JSON.parse(JSON.stringify(this.recipes()));

      cloneRecipes.push({
        costPrice: 0,
        extentId: 0,
        id: 0,
        itemId: this.data.id,
        summary: $event.summary,
        instructions: '',
        netWeight: 0,
        quantity: 0,
        ingredientId: $event.id,
        productId,
        precioCosto: 0,
        weight: 0,
        uuid: generateUuidv4(),
      });

      const results = cloneRecipes.map((e: Recipe) => {
        if (e.productId === productId) {
          e.extentId = extents[0].idMedida;
          e.precioCosto = extents[0].precioCosto;
          e.extents = JSON.stringify(extents);
        }
        return e;
      });
      this.recipes.set(results);
    });
  }

  getExtent(productId: number) {
    this.#ingredientService.get({ productId, tipo: 3 }).subscribe((response) => {
      const extents = response.extents;

      const results = this.recipes().map((e: Recipe) => {
        if (e.productId === productId) {
          e.extentId = extents[0].idMedida;
          e.precioCosto = extents[0].precioCosto;
          e.extents = JSON.stringify(extents);
        }
        return e;
      });
      this.recipes.set(results);
    });
  }
}
