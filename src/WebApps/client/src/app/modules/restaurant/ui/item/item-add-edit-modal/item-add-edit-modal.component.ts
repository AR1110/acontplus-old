import { Component, inject, OnInit } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Recipe } from '@restaurant/domain/models/recipe.model';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';

import { IngredientSearchComponent } from '@restaurant/ui/ingredient/ingredient-search/ingredient-search.component';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';
import { ItemService } from '@restaurant/data/services/item.service';
import { ToasterService } from '@core/services/toaster.service';
import { IngredientService } from '@restaurant/data/services/ingredient.service';
import { RecipeService } from '@restaurant/data/services/recipe.service';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';

@Component({
  selector: 'app-item-add-edit-modal',
  imports: [
    ReactiveFormsModule,
    TabulatorSemanticUiComponent,
    IngredientSearchComponent,
    ThemeButtonComponent,
    MatCustomDialogComponent,
  ],
  templateUrl: './item-add-edit-modal.component.html',
  styles: ``,
})
export class ItemAddEditModalComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  modalIcon = 'add';
  modalTitle = 'Registrar Item';
  itemForm = new FormGroup({
    id: new FormControl(0),
    summary: new FormControl('', [Validators.required]),
    recipe: new FormControl(''),
    instructions: new FormControl(''),
    cooking: new FormControl(false),
    productId: new FormControl(0),
  });
  recipes: Recipe[] = [];
  ingredientSearch = '';
  #ingredientService = inject(IngredientService);
  #itemService = inject(ItemService);
  #modalRef = inject(MatDialogRef<ItemAddEditModalComponent>);
  #recipeService = inject(RecipeService);
  #tS = inject(ToasterService);

  selectExtend = (cell: any, onRendered: any, success: any, cancel: any) => {
    let medidas = [];
    const rows = cell.getRow().getData();

    if (rows.extents !== undefined) {
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

        cell.getElement().dataset.descripcion =
          selectList.selectedOptions[0].text;
        cell.getElement().dataset.extentId =
          selectList.selectedOptions[0].value;
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

    if (row.extents !== undefined) {
      medidas = JSON.parse(row.extents);
    }

    if (medidas.length === 0) return '';
    return medidas.find((x: any) => x.idMedida == value).descripcion;
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

  columns = [
    {
      title: 'Ingrediente',
      field: 'summary',
      widthGrow: 1,
      width: 300,
    },
    {
      title: 'Medida',
      field: 'extentId',
      width: 150,
      editor: this.selectExtend,
      formatter: this.formatterMedida,
      cellEdited: this.priceUpdate,
    },
    {
      title: 'Peso',
      field: 'weight',
      editor: true,
      width: 100,
      widthGrow: 1,
      validator: ['numeric'],
    },
    {
      title: 'Instrucciones',
      field: 'instructions',
      widthGrow: 3,
      width: 200,
      editor: true,
    },
    {
      title: 'Cant.',
      field: 'quantity',
      width: 100,
      widthGrow: 1,
      editor: true,
      editorParams: {
        selectContents: true,
        verticalNavigation: 'table', //up and down arrow keys navigate away from cell without changing value
      },
      cellEdited: this.priceUpdate,
    },
    {
      title: 'Precio costo',
      field: 'precioCosto',
      width: 75,
      widthGrow: 1,
      editor: false,
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
    },
    {
      title: 'Acciones',
      widthGrow: 1,
      hozAlign: 'center',
      formatter: 'buttonCross',
      width: 100,
      align: 'center',
      cellClick: function (e: any, cell: any) {
        cell.getRow().delete();
      },
    },
  ];

  removeFromList(id: number) {
    const newArray = this.recipes.filter((x: Recipe) => x.id !== id);
  }

  getRecipes() {
    this.#recipeService.getByItem(this.data.id).subscribe((response) => {
      this.recipes = response.recipes;
    });
  }

  ngOnInit() {
    if (this.data.id > 0) {
      this.getRecipes();
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Item';
      this.itemForm.patchValue(this.data);
    }
  }

  onModalClose() {
    this.#modalRef.close();
  }

  onSave() {
    if (this.itemForm.invalid) {
      return this.#tS.toastr({
        type: 'warning',
        message: 'Revise los datos ingresados',
      });
    }
    const dataToSave = {
      itemJson: this.itemForm.value,
      recipeJson: this.recipes,
    };
    console.log(dataToSave);
    this.#itemService
      .put(this.data.id, { data: dataToSave })
      .subscribe((response) => {
        this.#tS.toastr({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          this.#modalRef.close(response);
        }
      });
  }

  onIngredientSelected($event: Ingredient) {
    this.recipes.push({
      costPrice: 0,
      extentId: 0,
      id: 0,
      itemId: this.data.id,
      summary: $event.summary,
      instructions: '',
      netWeight: 0,
      quantity: 0,
      ingredientId: $event.id,
      productId: $event.productId,
      precioCosto: 0,
    });
    this.getExtent($event.productId);
  }

  getExtent(productId: number) {
    this.#ingredientService
      .get({ productId, tipo: 3 })
      .subscribe((response) => {
        const extents = response.extents;
        this.recipes.forEach((e: Recipe, index: number) => {
          if (e.productId === productId) {
            e.extentId = extents[0].idMedida;
            e.precioCosto = extents[0].precioCosto;
            e.extents = JSON.stringify(extents);
          }
        });
      });
  }
}
