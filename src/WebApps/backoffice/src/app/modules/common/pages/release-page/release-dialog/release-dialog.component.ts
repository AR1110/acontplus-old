import { Component, inject } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from 'ngx-quill';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Aplicacion } from '@modules/config/models/aplicacion';
import { MatCheckbox } from '@angular/material/checkbox';

import { Release } from '@modules/common/models/release.model';
import { ReleaseService } from '@modules/common/services/release.service';

import { AplicacionService } from '@modules/config/services/aplicacion.service';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { MatIcon } from '@angular/material/icon';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-release-dialog',
  imports: [
    FormsModule,
    QuillModule,
    QuillEditorComponent,
    ReactiveFormsModule,
    MatCheckbox,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './release-dialog.component.html',
  styles: ``,
})
export class ReleaseDialogComponent {
  private readonly aplicacionService = inject(AplicacionService);
  private readonly dialogRef = inject(MatDialogRef<ReleaseDialogComponent>);
  private readonly releaseService = inject(ReleaseService);
  private readonly tS = inject(ToastrNotificationService);
  applications: Aplicacion[] = [];
  data = {} as Release;
  dialogIcon = 'add';
  dialogTitle: string = 'Registrar Nuevo Lanzamiento';
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['link', 'image', 'video'], // link and image, video
    ],
  };

  releaseForm = new FormGroup({
    id: new FormControl(0),
    aplicacionId: new FormControl(0, [Validators.required]),
    releaseDate: new FormControl(''),
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
      Validators.minLength(3),
    ]),
    content: new FormControl('', [Validators.required]),
    version: new FormControl(''),
    isActive: new FormControl(true),
    logoutRequired: new FormControl(false),
  });

  loadApps() {
    this.aplicacionService.get({}).subscribe((response) => {
      if (response && response.code == '1') {
        this.applications = response.payload as Aplicacion[];
      }
    });
  }

  ngOnInit(): void {
    this.loadApps();
    if (this.data.id > 0) {
      this.dialogIcon = 'edit';
      this.dialogTitle = 'Editar Lanzamiento';
      this.releaseForm.patchValue(this.data);
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }

  onSave() {
    const dataToSave = {
      ...this.releaseForm.value,
    };
    console.log(dataToSave);
    if (!(this.data.id > 0)) {
      this.releaseService.post(dataToSave).subscribe(this.commonResponse);
    } else {
      this.releaseService
        .put(this.data.id, dataToSave)
        .subscribe(this.commonResponse);
    }
  }

  commonResponse = (response: ApiResponse) => {
    if (response) {
      this.tS.show({
        type: response.code == '1' ? 'success' : 'warning',
        message: response.message,
      });
      if (response.code == '1') {
        this.dialogRef.close(response);
      }
    }
  };
}
