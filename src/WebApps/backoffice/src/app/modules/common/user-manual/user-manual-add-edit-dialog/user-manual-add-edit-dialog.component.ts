import { Component, inject } from '@angular/core';
import {
  UserManual,
  UserManualMenu,
  UserManualType,
} from '../../domain/models/user-manual.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserManualService } from '@modules/common/services/user-manual.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { notZeroValidator } from '@core/utils/data-validation';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatOption,
  MatSelect,
  MatSelectChange,
} from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { MatThemeButtonComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-user-manual-add-edit-dialog',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    QuillEditorComponent,
    MatDialogActions,
    MatDialogContent,
    MatThemeButtonComponent,
  ],
  templateUrl: './user-manual-add-edit-dialog.component.html',
  styles: ``,
})
export class UserManualAddEditDialogComponent {
  data = inject(MAT_DIALOG_DATA) as UserManual;
  dialogIcon: string = 'add';
  dialogTitle: string = 'Registrar Manual de Usuario';
  menus: UserManualMenu[] = [];
  menusFiltered: UserManualMenu[] = [];

  userManualTypes: UserManualType[] = [];
  userManualTypeCode: unknown = '';
  #dialogRef = inject(MatDialogRef<UserManualAddEditDialogComponent>);

  private readonly _userManualService = inject(UserManualService);
  private readonly _tS = inject(ToastrNotificationService);
  userManualForm = new FormGroup({
    id: new FormControl(0),
    userManualTypeId: new FormControl(0, [
      Validators.required,
      notZeroValidator(),
    ]),
    menuId: new FormControl(0),
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
    ]),
    content: new FormControl('', [Validators.required]),
  });
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

  loadData() {
    this._userManualService.getDataForm().subscribe((response) => {
      this.userManualTypes = response.userManualTypes;
      this.menus = response.menus;
    });
  }

  ngOnInit() {
    if (this.data.id > 0) {
      this.dialogIcon = 'edit';
      this.dialogTitle = 'Editar Manual de Usuario';
      this.userManualForm.patchValue(this.data);
    }
    this.loadData();
  }

  onClose() {
    this.#dialogRef.close();
  }

  onMenuChange($event: any) {
    this.menusFiltered = this.menus.filter((x) => x.menuId == $event.value);
  }

  onSubmenuChange($event: any) {
    if (this.menusFiltered.length > 0 && $event.value == 0) {
      this.menusFiltered = [];
    }
  }

  onSave() {
    if (this.userManualForm.invalid) {
      return this._tS.show({
        type: 'warning',
        message: 'Revise los datos del formulario',
      });
    }

    if (this.userManualForm.get('menuId')?.value == 0) {
      this.userManualForm.get('menuId')?.setValue(null);
    }

    if (this.userManualForm.get('menuId')?.value == 0) {
      this.userManualForm.get('menuId')?.setValue(null);
    }

    const dataToSave = {
      ...this.userManualForm.value,
    };

    if (this.data.id > 0) {
      this._userManualService
        .put(this.data.id, dataToSave)
        .subscribe(this.commonResponse);
    } else {
      this._userManualService.post(dataToSave).subscribe(this.commonResponse);
    }
  }

  onUserManualTypeChange($event: MatSelectChange) {
    const userManualTypeSelected = this.userManualTypes.find(
      (x) => x.id === $event.value,
    );
    this.userManualTypeCode = userManualTypeSelected?.code;
  }

  commonResponse = (response: ApiResponse) => {
    this._tS.show({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.#dialogRef.close(response);
    }
  };
}
