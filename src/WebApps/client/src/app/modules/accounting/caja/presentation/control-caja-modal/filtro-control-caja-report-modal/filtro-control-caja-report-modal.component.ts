import { Component, inject } from '@angular/core';
import { REPORT_CODE, REPORT_FORMAT } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response-legacy';
import { SharedService } from '@core/services/shared.service';
import { UserPermissionService } from '@modules/config/services/user-customer/user-permission.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filtro-caja-page-modal-report-modal',
  imports: [FormsModule, Button, MatCustomDialogComponent, MatFormFieldModule, MatSelectModule],
  templateUrl: './filtro-control-caja-report-modal.component.html',
})
export class FiltroControlCajaReportModal {
  private dialogRef = inject(MatDialogRef<FiltroControlCajaReportModal>);
  params = inject<{
    id: 0;
    enterKey: false;
  }>(MAT_DIALOG_DATA);
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
  private format = REPORT_FORMAT.PDF;

  askToReport(format: string) {
    try {
      if (format === REPORT_FORMAT.PDF) {
        this.format = REPORT_FORMAT.PDF;
      } else {
        this.format = REPORT_FORMAT.EXCEL;
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
            const obj = {
              typeCheck: 1,
              clave,
            };

            const response = await this.userPermissionSvc.checkHasPermission(obj).toPromise();

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
    const dataParms = {
      tipo: 1,
      id: this.params.id,
      sortByDefault: this.dataSearch.sortByDefault,
      sortOrder: this.dataSearch.sortOrder,
    };
    const parameters = {
      hasService: true, //reporte sin idRol, si es true el idRol(idUsuariol) enviamos en un json
      reportParams: JSON.stringify({
        codigo: REPORT_CODE.RCC,
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

  close() {
    this.dialogRef.close();
  }
}
