import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicCard } from '@acontplus/ng-components';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';

import { QuillEditorComponent } from 'ngx-quill';
import { templates } from '@modules/common/utils/templates';
import { EmailQueueUseCase } from '@modules/common/core/use-cases/email-queue-use-case';
import { MatIcon } from '@angular/material/icon';
export enum RecipientType {
  USERS = 'U',
  CUSTOMERS = 'C',
}
@Component({
  selector: 'app-email-queue',
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatCheckbox,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatLabel,
    MatError,
    DynamicCard,
    BreadcrumbComponent,
    MatIcon,
    QuillEditorComponent,
  ],
  templateUrl: './email-queue.component.html',
  styles: [``],
})
export class EmailQueueComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _emailQueueUseCase = inject(EmailQueueUseCase);

  emailForm: FormGroup;
  RecipientType = RecipientType;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.emailForm = this._fb.group({
      isMassive: [false],
      recipientType: [RecipientType.USERS],
      recipientEmail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      cc: [''],
      body: ['', Validators.required],
      template: ['Custom'],
      isHtml: [false],
    });
  }

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['clean'],
      [{ align: [] }],
      ['link'],
    ],
  };

  onMassiveChange(event: any): void {
    if (event.checked) {
      this.emailForm.get('recipientEmail')?.disable();
      this.emailForm.get('recipientType')?.enable();
    } else {
      this.emailForm.get('recipientEmail')?.enable();
      this.emailForm.get('recipientType')?.disable();
    }
  }

  onTemplateChange(template: string) {
    if (templates[template]) {
      this.emailForm.patchValue({ body: templates[template] });
    }
  }

  onSubmit(): void {
    if (this.emailForm.valid) {
      const formData = {
        ...this.emailForm.value,
      };
      console.log('Email Queue Data:', formData);
      this._emailQueueUseCase.send(formData).subscribe((response) => {
        this._snackBar.open('Email queued successfully!', 'Close', {
          duration: 3000,
        });
        this.emailForm.reset();
      });
    }
  }
}
