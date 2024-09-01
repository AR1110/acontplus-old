import { Component, inject, input, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ToasterService } from "@core/services/toaster.service";
import { TabulatorComponent } from "@core/components/tabulator/tabulator.component";
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faPlusSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';
import { DocConfig } from '@modules/config/models/doc-config.model';
import { isValidField } from '@core/utils/utils';
import { DocConfigService } from '@modules/config/services/doc-config.service';
import { hideLoader, showLoader } from '@core/utils/loader';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-doc-config-info-adicional',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, TabulatorComponent],
  templateUrl: './doc-config-info-adicional.component.html',
  styles: ``
})
export class DocConfigInfoAdicionalComponent {
  params = input.required<DocConfig>();

  private tS = inject(ToasterService);
  private docConfigSvc = inject(DocConfigService);
  modal = inject(NgbActiveModal)

  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  infoAdicional: any[] = [];


  readonly columns = [
    {
      title: `${icon(faPlusSquare).html.join('')}`,
      headerHozAlign: 'center',
      headerSort: false,
      headerClick: () => { this.infoAdicional.push({}); },
      formatter: (cell: any) => {

        //create delete button
        let delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-xs');
        delBtn.addEventListener('click', () => {
          let rowData = cell.getRow().getData();
          console.log(rowData);
          this.askToDelete(rowData);
        });

        let buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);

        return buttonHolder;
      },
    },
    {
      title: "Nombre",
      field: "nombre",
      width: "35px",
      responsive: 0,
      headerSort: false,
      editor: true
    },
    {
      title: "Valor",
      field: "Valor",
      width: "60px",
      headerSort: false,
      editor: true
    },
  ]

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

      if (this.infoAdicional.length === 0) {
        this.tS.toastr({
          type: 'warning',
          message: 'Ingrese al menos un dato adicional'
        })
        return
      }
      if (this.infoAdicional.some(item => !(isValidField(item.nombre) || isValidField(item.valor)))) {
        this.tS.toastr({
          type: 'warning',
          message: 'Los campos no pueden estar vacio'
        })
        return
      }


      const data = {
        idConfiguracionDocumento: this.params().idConfiguracionDocumento,
        idPuntoEmision: this.params().idPuntoEmision,
        idTipoDocumento: this.params().idTipoDocumento,
        estado: this.params().estado,
        ultimaSecuencia: this.params().ultimaSecuencia,
        infoAdicional: JSON.stringify(this.infoAdicional)
      };

      showLoader();
      this.docConfigSvc.post(data).subscribe({
        next: (response) => {
          hideLoader()

          if (response.code === "0") {
            this.tS.toastr({
              type: 'warning',
              message: response.message
            })
          }
          if (response.code === "1") {
            this.tS.toastr({
              type: 'success',
              message: response.message
            })
            this.modal.close(response);
          }
        },
        error(err) {
          hideLoader();
          console.log(err)
        },
      })


    } catch (error) {
      console.log(error)
    }
  }

}
