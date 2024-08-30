import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ToasterService } from "@core/services/toaster.service";
import { TabulatorComponent } from "@core/components/tabulator/tabulator.component";
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faPlusSquare,faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doc-config-info-adicional',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, TabulatorComponent],
  templateUrl: './doc-config-info-adicional.component.html',
  styles: ``
})
export class DocConfigInfoAdicionalComponent {
  private tS = inject(ToasterService);
  @ViewChild(TabulatorComponent) tabulatorComponent!: TabulatorComponent;

  infoAdicional: any[] = [];

  
  readonly columns = [
    {
      title: `${icon(faPlusSquare).html.join('')}`,
      headerHozAlign: 'center',
      headerSort: false,
      headerClick: ()=> { this.infoAdicional.push({}); },
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
    { title: "Nombre",
      field: "nombre", 
      width: "35px", 
      responsive: 0, 
      headerSort: false, 
      editor : true 
    },
    { title: "Valor", 
      field: "Valor", 
      width: "60px", 
      headerSort: false, 
      editor : true 
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
}
