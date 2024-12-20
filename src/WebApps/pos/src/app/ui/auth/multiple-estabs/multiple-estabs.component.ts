import {Component, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {ToasterService} from "@domain/services/toaster.service";
import { CustomContainerDialogComponent } from '@ui/components/custom-container-dialog/custom-container-dialog.component';
import {AuthUseCase} from "@domain/use-cases/auth.use-case";
@Component({
    selector: 'app-multiple-estabs',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        CustomContainerDialogComponent
    ],
    templateUrl: './multiple-estabs.component.html'
})
export class MultipleEstabsComponent {
  readonly dialogRef = inject(MatDialogRef<MultipleEstabsComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);
  private _authUseCase = inject(AuthUseCase);
  private tS = inject(ToasterService)

  readonly panelOpenState = signal(false);
  multipleEstabs = signal<any>([])

  ngOnInit() {
    this.multipleEstabs.set(this.params.multipleEstabs)
  }


  onSelect (result: any) {
    const dataFinded = structuredClone(this.multipleEstabs()).find((pp: any) => pp.companyId === result.idEntidad)

    if (dataFinded) {
      const establecimientos = this.multipleEstabs().flatMap((userRole: any) => userRole.establecimientos);

      const dataEstab = establecimientos.find((estab: any) => estab.codEstab === result.codEstab);
      dataFinded.bussinesName = dataEstab.nombreComercial;
      this._authUseCase.createToken(dataFinded).subscribe(response => {
        if (response.code === "0") {
          this.tS.toastr({
            type: 'warning',
            message: response.message
          })
        }
        if (response.code === "1") {
          this.tS.toastr({
            type: 'success',
            message: "Inciando Sessión"
          })
          const dataLogin = JSON.parse(response.payload as string);

          this.dialogRef.close({
            dataEstab,dataLogin
          })
        }
      })
    }
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
