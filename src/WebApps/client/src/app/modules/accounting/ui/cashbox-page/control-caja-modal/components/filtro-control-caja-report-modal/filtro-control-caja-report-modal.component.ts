import { Component, inject, Input } from '@angular/core';
import { CODE_REPORT, FORMAT_REPORT } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { SharedService } from '@core/services/shared.service';
import { UserPermissionService } from '@modules/config/services/user-customer/user-permission.service';
import {
  NgbActiveModal,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";

@Component({
  selector: 'app-filtro-control-caja-modal-report-modal',
  imports: [FormsModule, NgbTimepickerModule, MatIcon, MatButton, ThemeButtonComponent],
  templateUrl: './filtro-control-caja-report-modal.component.html',
})
export class FiltroControlCajaReportModal {
  @Input('params') params = {
    id: 0,
    enterKey: false,
  };
  activeModal = inject(NgbActiveModal);
  dataSearch = {
    sortByDefault: 0,
    sortOrder: 'ASC',
  };
  sortByDefaults = [
    { id: 0, description: 'Fecha Emisión' },
    { id: 1, description: 'Tipo Documento' },
  ];
  sortOrders = [
    { codigo: 'ASC', description: 'ASC' },
    { codigo: 'DESC', description: 'DESC' },
  ];
  private sharedSvc = inject(SharedService);
  private userPermissionSvc = inject(UserPermissionService);
  private format = FORMAT_REPORT.PDF;

  askToReport(format: string) {
    try {
      if (format === FORMAT_REPORT.PDF) {
        this.format = FORMAT_REPORT.PDF;
      } else {
        this.format = FORMAT_REPORT.EXCEL;
      }
      if (this.params.enterKey) {
        Swal.fire({
          title: 'Ingrese su clave',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showDenyButton: true,
          confirmButtonText: 'Continuar',
          denyButtonText: 'Cancelar',
          showLoaderOnConfirm: true,
          allowEscapeKey: false,
          backdrop: true,
          preConfirm: async (clave) => {
            let obj = {
              typeCheck: 1,
              clave,
            };

            const response = await this.userPermissionSvc
              .checkHasPermission(obj)
              .toPromise();

            if (isApiResponse(response)) {
              if (response.code === '0') {
                Swal.showValidationMessage(`${response.message}`);
              }
              if (response.code === '1') {
                return response.code;
              }
            }

            return true;
          },
          allowOutsideClick: () => Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            this.generateReport();
          }
        });
      } else {
        this.generateReport();
      }
    } catch (error) {
      console.log(error);
    }
  }

  generateReport() {
    let dataParms = {
      tipo: 1,
      id: this.params.id,
      sortByDefault: this.dataSearch.sortByDefault,
      sortOrder: this.dataSearch.sortOrder,
    };
    const parameters = {
      hasService: true, //reporte sin idRol, si es true el idRol(idUsuariol) enviamos en un json
      reportParams: JSON.stringify({
        codigo: CODE_REPORT.RCC,
        format: this.format,
        aditionalParams: [],
      }),
      dataParams: JSON.stringify(dataParms),
    };
    this.sharedSvc.getReport({
      data: parameters,
      format: this.format,
      isOldVersion: true,
    });
  }
}
