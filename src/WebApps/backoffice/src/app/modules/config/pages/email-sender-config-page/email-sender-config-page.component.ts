import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { EmailSenderConfigService } from '@modules/config/services/email-sender-config-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { EmailSenderConfig } from '@modules/config/models/email-sender-config.model';
import Swal from 'sweetalert2';
import {
  ColumnDefinition,
  MatDynamicTableComponent,
} from 'acontplus-ui-components';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrNotificationService } from 'acontplus-utils';

@Component({
  selector: 'app-email-sender-config-page',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    MatCardModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatDynamicTableComponent,
    MatIconModule,
    MatButton,
  ],
  templateUrl: './email-sender-config-page.component.html',
  styles: ``,
})
export class EmailSenderConfigPageComponent {
  private readonly _emailSenderConfigService = inject(EmailSenderConfigService);
  private readonly _tS = inject(ToastrNotificationService);
  columnsDefs: ColumnDefinition[] = [
    { key: 'op', label: 'Op.', type: 'string' },
    { key: 'senderEmail', label: 'Sender Email', type: 'string' },
    { key: 'senderName', label: 'Sender Name', type: 'string' },
    { key: 'isGlobal', label: 'Global', type: 'boolean' },
    { key: 'useSsl', label: 'Use Ssl', type: 'boolean' },
    { key: 'smtpPort', label: 'Smtp Port', type: 'number' },
    { key: 'username', label: 'Username', type: 'string' },
    { key: 'isActive', label: 'isActive', type: 'boolean' },
  ];
  columns: string[] = this.columnsDefs.map((colDef) => colDef.key);
  data: EmailSenderConfig = {
    isActive: false,
    id: 0,
    isGlobal: false,
    password: '',
    senderEmail: '',
    senderName: '',
    smtpPort: 0,
    smtpServer: '',
    useSsl: false,
    username: '',
  };

  emailSenderConfigs: EmailSenderConfig[] = [];

  loadData() {
    this._emailSenderConfigService.getData().subscribe((response) => {
      this.emailSenderConfigs = response.emailSenderConfigs;
    });
  }

  ngOnInit() {
    this.loadData();
  }

  askToSave() {
    Swal.fire({
      text: 'Esta seguro de guardar los parametros de Email!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.data.id > 0) {
          this._emailSenderConfigService
            .put(this.data.id, this.data)
            .subscribe((response) => {
              this._tS.show({
                type: response.code === '1' ? 'success' : 'warning',
                message: response.message,
              });
              this.loadData();
            });
        } else {
          this._emailSenderConfigService
            .post(this.data)
            .subscribe((response) => {
              this._tS.show({
                type: response.code === '1' ? 'success' : 'warning',
                message: response.message,
              });
              if (response.code == '1') {
                this.loadData();
              }
            });
        }
      }
    });
  }
}
