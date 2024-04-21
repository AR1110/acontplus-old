import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import { isApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Brand } from '@modules/technical-support/models/brand';
import { Category } from '@modules/technical-support/models/category';
import { Serie } from '@modules/technical-support/models/serie';
import { BrandService } from '@modules/technical-support/services/brand.service';
import { CategoryService } from '@modules/technical-support/services/category.service';
import { SerieService } from '@modules/technical-support/services/serie.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brand-modal',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, TabulatorComponent],
  templateUrl: './brand-modal.component.html',
  styles: ``,
})
export class BrandModalComponent {
  private brandService = inject(BrandService);
  private categoryService = inject(CategoryService);
  private modalRef = inject(NgbActiveModal);
  private serieService = inject(SerieService);
  private tS = inject(ToasterService);
  brandForm = new FormGroup({
    id: new FormControl(0),
    categoryId: new FormControl(0, Validators.required),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
  });
  categories: Category[] = [];
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
        let rowDataMain = cell.getRow().getData();
        // let editBtn = document.createElement('button');
        // editBtn.type = 'button';
        // editBtn.innerHTML = `${icon(faSave).html.join('')}`;
        // editBtn.classList.add('btn', 'btn-success', 'btn-sm');
        // editBtn.addEventListener('click', () => {
        //   let rowData = cell.getRow().getData();
        //   //this.editDetail(rowData);
        // });

        //create delete button
        let delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-r-5');
        delBtn.addEventListener('click', () => {
          let rowData = cell.getRow().getData();
          if (rowData.id > 0) {
            this.onSerieDelete(rowData);
          } else {
            cell.getRow().delete();
          }
        });

        let buttonHolder = document.createElement('span');
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
  data: Brand = {
    id: 0,
    code: '',
    name: '',
    categoryName: '',
  };
  modalIcon: IconProp = 'plus';
  modalTitle = 'Registrar Marca';
  series: Serie[] = [];

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Marca';
      this.brandForm.patchValue(this.data);
    }
    this.onGet();
  }
  onGet() {
    showLoader();
    if (this.data.id > 0 && Number(JSON.parse(this.data.series as string)?.length) > 0) {
      this.series = JSON.parse(this.data.series as string) || [];
    }
    this.categoryService.get({}).subscribe({
      next: (response) => {
        if (isApiResponse(response)) {
          if (response.code == '1') {
            this.categories = JSON.parse(response.payload as string);
          }
        }
      },
      error(err) {
        hideLoader();
        console.log(err);
      },
      complete() {
        hideLoader();
      },
    });
  }
  onModalClose() {
    this.modalRef.close();
  }
  onSave() {
    showLoader();
    if (this.series.length > 0) {
      this.series.forEach((x) => {
        if (!x.code) {
          hideLoader();
          return this.tS.toastr({
            type: 'warning',
            message: 'Código de la serie invalido',
          });
        }
        if (!x.name) {
          hideLoader();
          return this.tS.toastr({
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
      this.brandService.put(this.data.id, dataToSave).subscribe({
        next: this.successResponse,
        error(err) {
          console.error(err);
          hideLoader();
        },
        complete() {
          hideLoader();
        },
      });
    } else {
      this.brandService.post(dataToSave).subscribe({
        next: this.successResponse,
        error(err) {
          console.error(err);
          hideLoader();
        },
        complete() {
          hideLoader();
        },
      });
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
        showLoader();
        this.serieService.delete(item.id).subscribe({
          next: (response) => {
            if (isApiResponse(response)) {
              this.tS.toastr({
                type: response.code === '1' ? 'success' : 'warning',
                message: response.message,
              });
              if (response.code === '1') {
                this.series.splice(
                  this.series.findIndex((x) => x.id == item.id),
                  1
                );
              }
            }
          },
          error(err) {
            hideLoader();
            console.log(err);
          },
          complete() {
            hideLoader();
          },
        });
      }
    });
  }
  successResponse = (response: object) => {
    if (isApiResponse(response)) {
      this.tS.toastr({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code == '1') {
        this.modalRef.close(response);
      }
    }
  };
}
