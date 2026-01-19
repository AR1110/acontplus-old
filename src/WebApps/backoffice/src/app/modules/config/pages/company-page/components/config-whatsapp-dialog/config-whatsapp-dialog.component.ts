import { Component, inject, Input } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { WhatsappUsageService } from '@modules/config/services/whatsapp-usage.service';
import { WhatsappUsage } from '@modules/config/models/whatsapp-usage.model';
import { InputDateComponent } from '@shared/components/input-date/input-date.component';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-config-whatsapp-dialog',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    InputDateComponent,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './config-whatsapp-dialog.component.html',
})
export class ConfigWhatsappDialogComponent {
  @Input({ required: true }) params = {
    companyId: 0,
  };
  private dialogRef = inject(MatDialogRef<ConfigWhatsappDialogComponent>);
  tS = inject(ToastrNotificationService);
  private readonly _whatsappUsageService = inject(WhatsappUsageService);

  data = {} as WhatsappUsage;

  commonResponse = (response: ApiResponse) => {
    this.tS.show({
      type: response.code === '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.dialogRef.close(response);
    }
  };

  ngOnInit() {
    this._whatsappUsageService
      .getDataByCompanyId(this.params.companyId)
      .subscribe((response) => {
        this.data = response;
        this.data.used ??= 0;
        this.data.limit ??= 0;
      });
  }

  save() {
    try {
      if (this.data.limit < 1 && !this.data.unlimited) {
        this.tS.show({
          type: 'warning',
          message: 'El limite debe ser mayor a 1',
        });
        return;
      }

      if (this.data.id > 0) {
        this._whatsappUsageService
          .put(this.data.id, this.data)
          .subscribe(this.commonResponse);
      } else {
        this.data.companyId = this.params.companyId;
        this._whatsappUsageService
          .post(this.data)
          .subscribe(this.commonResponse);
      }
    } catch (err) {
      console.log(err);
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }
}
