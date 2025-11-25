import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabulatorTable, Button } from '@acontplus/ng-components';
import { isApiResponse } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { Brand } from '@modules/technical-support/models/brand';
import { Category } from '@modules/technical-support/models/category';
import { Serie } from '@modules/technical-support/models/serie';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { CategoryService } from '@modules/technical-support/services/category.service';
import { SerieService } from '@modules/technical-support/services/serie.service';
import Swal from 'sweetalert2';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-brand-modal',
  imports: [ReactiveFormsModule, TabulatorTable, Button, MatCustomDialogComponent],
  templateUrl: './brand-modal.component.html',
  styles: ``,
})
export class BrandModalComponent implements OnInit {
  private brandService = inject(BrandService);
  private categoryService = inject(CategoryService);
  private modalRef = inject(MatDialogRef<BrandModalComponent>);
  private serieService = inject(SerieService);
  private tS = inject(ToastrNotificationService);
  brandForm = new FormGroup({
    id: new FormControl(0),
    categoryId: new FormControl(0, Validators.required),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(25),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
  });
  categories = signal<Category[]>([]);
  columnNames = [
    {
      title: 'id',
      field: 'id',
      visible: false,
    },
    {
      title: 'Código',
      field: 'code',
      sorter: 'string',
      editor: true,
      width: 200,
    },
    {
      title: 'Nombre',
      field: 'name',
      sorter: 'string',
      editor: true,
      width: 300,
    },
    {
      title: 'Año',
      field: 'year',
      sorter: 'number',
      editor: true,
      width: 150,
    },
    {
      formatter: (cell: any) => {
        const rowDataMain = cell.getRow().getData();
        // let editBtn = document.createElement('button');
        // editBtn.type = 'button';
        // editBtn.innerHTML = `${icon(faSave).html.join('')}`;
        // editBtn.classList.add('btn', 'btn-success', 'btn-sm');
        // editBtn.addEventListener('click', () => {
        //   let rowData = cell.getRow().getData();
        //   //this.editDetail(rowData);
        // });

        //create delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `<i class="material-icons" style="cursor:pointer;">delete</i>`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-r-5');
        delBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          if (rowData.id > 0) {
            this.onSerieDelete(rowData);
          } else {
            cell.getRow().delete();
          }
        });

        const buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);
        // if (rowDataMain.id > 0) {
        //   buttonHolder.appendChild(editBtn);
        // }
        return buttonHolder;
      },
      hozAlign: 'center',
      resizable: false,
      title: 'Opción',
      width: 150,
    },
  ];
  data = inject<Brand>(MAT_DIALOG_DATA);
  modalIcon = 'add';
  modalTitle = 'Registrar Marca';
  series: Serie[] = [];

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Marca';
      this.brandForm.patchValue(this.data);
    }
    if (this.data.id > 0 && Number(JSON.parse(this.data.series!)?.length) > 0) {
      this.series = JSON.parse(this.data.series!) || [];
    }
    if (this.data.categoryId > 0) {
      this.brandForm.get('categoryId')?.setValue(this.data.categoryId);
    }
    this.onGet();
  }
  onGet() {
    this.categoryService.get({}).subscribe((response) => {
      if (isApiResponse(response)) {
        if (response.code == '1') {
          this.categories.set(JSON.parse(response.payload as string));
        }
      }
    });
  }
  onModalClose() {
    this.modalRef.close();
  }
  onSave() {
    if (this.series.length > 0) {
      this.series.forEach((x) => {
        if (!x.code) {
          return this.tS.show({
            type: 'warning',
            message: 'Código de la serie invalido',
          });
        }
        if (!x.name) {
          return this.tS.show({
            type: 'warning',
            message: 'Nombre de la serie invalido',
          });
        }
      });
    }
    const dataToSave = {
      ...this.brandForm.value,
      series: this.series || [],
    };
    if (this.data.id > 0) {
      this.brandService.put(this.data.id, dataToSave).subscribe(this.successResponse);
    } else {
      this.brandService.post(dataToSave).subscribe(this.successResponse);
    }
  }
  onSerieAdd() {
    this.series.push({
      id: 0,
      code: '',
      name: '',
    });
  }
  onSerieDelete(item: Serie) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      html: `Esta seguro de eliminar la serie: <b>${item.name}</b>`,
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Si',
    }).then((response) => {
      if (response.isConfirmed) {
        this.serieService.delete(item.id).subscribe((response) => {
          if (isApiResponse(response)) {
            this.tS.show({
              type: response.code === '1' ? 'success' : 'warning',
              message: response.message,
            });
            if (response.code === '1') {
              this.series.splice(
                this.series.findIndex((x) => x.id == item.id),
                1,
              );
            }
          }
        });
      }
    });
  }
  successResponse = (response: object) => {
    if (isApiResponse(response)) {
      this.tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code == '1') {
        this.modalRef.close(response);
      }
    }
  };
}
