import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToasterService } from '@core/services/toaster.service';
import { TabulatorComponent } from '@core/components/tabulator/tabulator.component';
import Swal from 'sweetalert2';
import { isValidField } from '@core/utils/utils';
import { DocConfigService } from '@modules/config/services/doc-config.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-doc-config-info-adicional',
  imports: [FormsModule, TabulatorComponent, MatButton],
  templateUrl: './doc-config-info-adicional.component.html',
  styles: ``,
})
export class DocConfigInfoAdicionalComponent {
  @Input() params = {} as any;

  private tS = inject(ToasterService);
  private docConfigSvc = inject(DocConfigService);
  modal = inject(NgbActiveModal);

  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  infoAdicional: any[] = [];

  getInfoAdicional() {
    this.infoAdicional = [];
    this.docConfigSvc
      .getInfoAdicional(this.params.idConfiguracionDocumento)
      .subscribe((response) => {
        this.infoAdicional = response.infoAdicional || [];
      });
  }

  ngOnInit() {
    this.getInfoAdicional();
  }

  readonly columns = [
    {
      title: `<i class="material-icons" style="cursor:pointer;">add_box</i>`, // reemplazo de faPlusSquare
      headerHozAlign: 'center',
      headerSort: false,
      headerClick: () => {
        this.infoAdicional.push({});
      },
      formatter: (cell: any) => {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `<i class="material-icons" style="font-size:16px;">delete</i>`; // reemplazo de faTrashAlt
        delBtn.classList.add('btn', 'btn-danger', 'btn-xs');
        delBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          console.log(rowData);
          this.askToDelete(rowData);
        });

        const buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);

        return buttonHolder;
      },
    },
    {
      title: 'Nombre',
      field: 'nombre',
      width: '35px',
      responsive: 0,
      headerSort: false,
      editor: true,
    },
    {
      title: 'Valor',
      field: 'valor',
      width: '60px',
      headerSort: false,
      editor: true,
    },
  ];

  askToDelete(data: any) {
    try {
      Swal.fire({
        html: `Esta seguro de eliminar este elemento`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'No!',
      }).then((result) => {
        if (result.isConfirmed) {
          let index = this.infoAdicional.indexOf(data);
          this.infoAdicional.splice(index, 1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  save() {
    try {
      if (
        this.infoAdicional.some(
          (item) => !(isValidField(item.nombre) || isValidField(item.valor)),
        )
      ) {
        this.tS.toastr({
          type: 'warning',
          message: 'Los campos no pueden estar vacio',
        });
        return;
      }

      const data = {
        id: this.params.idConfiguracionDocumento,
        idPuntoEmision: this.params.idPuntoEmision,
        idTipoDocumento: this.params.idTipoDocumento,
        estado: this.params.estado,
        ultimaSecuencia: this.params.ultimaSecuencia,
        editInfo: true,
        infoAdicional:
          this.infoAdicional.length == 0
            ? null
            : JSON.stringify(this.infoAdicional),
      };

      this.docConfigSvc.post(data).subscribe({
        next: (response) => {
          if (response.code === '0') {
            this.tS.toastr({
              type: 'warning',
              message: response.message,
            });
          }
          if (response.code === '1') {
            this.tS.toastr({
              type: 'success',
              message: response.message,
            });
            this.modal.close(response);
          }
        },
        error(err) {
          console.log(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
