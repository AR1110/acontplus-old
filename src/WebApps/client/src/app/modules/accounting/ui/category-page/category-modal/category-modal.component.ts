import { Component, inject, OnInit } from '@angular/core';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '@technical-support/models/category';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { CATEGORY_HTTP_TOKEN } from '@accounting/data/accounting-token';
import { Button } from '@acontplus/ng-components';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-page-modal',
  imports: [
    ReactiveFormsModule,
    Button,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './category-modal.component.html',
  styles: ``,
})
export class CategoryModalComponent implements OnInit {
  categoryForm = new FormGroup({
    id: new FormControl(0),
    tipoId: new FormControl(0, Validators.required),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(25),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    enabled: new FormControl(true),
  });
  data = inject<Category>(MAT_DIALOG_DATA);
  tipos: any[] = [];
  private _categoryHttp = inject(CATEGORY_HTTP_TOKEN);

  private modalRef = inject(MatDialogRef<CategoryModalComponent>);
  private tS = inject(ToastrNotificationService);

  get() {
    this._categoryHttp.get({ tipo: 2 }).subscribe((response) => {
      if (response.code == '1') {
        const { tipos } = JSON.parse(response.payload as string);
        this.tipos = tipos;
      }
    });
  }

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.categoryForm.patchValue(this.data);
    }
    this.get();
  }


  onSave() {
    const dataToSave = {
      ...this.categoryForm.value,
    };
    if (!(this.data.id > 0)) {
      this._categoryHttp.post(dataToSave).subscribe(this.successResponse);
    } else {
      this._categoryHttp.put(this.data.id, dataToSave).subscribe(this.successResponse);
    }
  }

  successResponse = (response: ApiResponseLegacy) => {
    this.tS.show({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.modalRef.close(response);
    }
  };
}
