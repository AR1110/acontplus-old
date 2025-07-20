import { Component, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatError } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { UserData } from '@modules/config/domain/models/wizard-config/value-objects/user-data.vo';
import { WizardConfigStore } from '@modules/config/application/store/wizard-config.store';

export interface UserFormControls {
  nroIdentificacion: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
}

@Component({
  selector: 'app-user-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
    ToUpperCaseDirective,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        @if (isLoading()) {
          <div class="loading-container">
            <mat-icon class="loading-icon">hourglass_empty</mat-icon>
            <p>Cargando datos del usuario...</p>
          </div>
        } @else {
          <form [formGroup]="userForm" (ngSubmit)="onSave()">
            <div class="form-header">
              <h3>Datos del Usuario</h3>
              <p>Complete la información personal del usuario principal del sistema.</p>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Número de Identificación</mat-label>
                <input
                  matInput
                  formControlName="nroIdentificacion"
                  placeholder="Ingrese número de identificación"
                  toUpperCase
                  [attr.aria-describedby]="'identificacion-error'"
                />
                @if (userForm.get('nroIdentificacion')?.hasError('required') && userForm.get('nroIdentificacion')?.touched) {
                  <mat-error id="identificacion-error">Número de identificación es requerido</mat-error>
                }
                @if (userForm.get('nroIdentificacion')?.hasError('minlength')) {
                  <mat-error>Debe tener al menos 10 dígitos</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Nombres</mat-label>
                <input
                  matInput
                  formControlName="firstName"
                  placeholder="Ingrese nombres"
                  toUpperCase
                  [attr.aria-describedby]="'firstName-error'"
                />
                @if (userForm.get('firstName')?.hasError('required') && userForm.get('firstName')?.touched) {
                  <mat-error id="firstName-error">Los nombres son requeridos</mat-error>
                }
                @if (userForm.get('firstName')?.hasError('minlength')) {
                  <mat-error>Los nombres deben tener al menos 2 caracteres</mat-error>
                }
                @if (userForm.get('firstName')?.hasError('maxlength')) {
                  <mat-error>Los nombres no pueden exceder 50 caracteres</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Apellidos</mat-label>
                <input
                  matInput
                  formControlName="lastName"
                  placeholder="Ingrese apellidos"
                  toUpperCase
                  [attr.aria-describedby]="'lastName-error'"
                />
                @if (userForm.get('lastName')?.hasError('required') && userForm.get('lastName')?.touched) {
                  <mat-error id="lastName-error">Los apellidos son requeridos</mat-error>
                }
                @if (userForm.get('lastName')?.hasError('minlength')) {
                  <mat-error>Los apellidos deben tener al menos 2 caracteres</mat-error>
                }
                @if (userForm.get('lastName')?.hasError('maxlength')) {
                  <mat-error>Los apellidos no pueden exceder 50 caracteres</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Correo Electrónico</mat-label>
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  placeholder="ejemplo@correo.com"
                  [attr.aria-describedby]="'email-error'"
                />
                @if (userForm.get('email')?.hasError('email') && userForm.get('email')?.touched) {
                  <mat-error id="email-error">Formato de correo inválido</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Teléfono</mat-label>
                <input
                  matInput
                  formControlName="phone"
                  placeholder="(02) 123-4567"
                  [attr.aria-describedby]="'phone-error'"
                />
                @if (userForm.get('phone')?.hasError('pattern') && userForm.get('phone')?.touched) {
                  <mat-error id="phone-error">Formato de teléfono inválido</mat-error>
                }
              </mat-form-field>
            </div>

            @if (formErrors().length > 0) {
              <div class="form-errors" role="alert" aria-live="polite">
                <h4>Errores de validación:</h4>
                <ul>
                  @for (error of formErrors(); track error) {
                    <li>{{ error }}</li>
                  }
                </ul>
              </div>
            }

            <div class="form-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!userForm.valid || isSaving()"
                [attr.aria-describedby]="'save-button-description'"
              >
                @if (isSaving()) {
                  <mat-icon>hourglass_empty</mat-icon>
                  Guardando...
                } @else {
                  <mat-icon>save</mat-icon>
                  Guardar Usuario
                }
              </button>
              <span id="save-button-description" class="sr-only">
                {{ userForm.valid ? 'Formulario válido, puede guardar' : 'Formulario inválido, corrija los errores' }}
              </span>
            </div>
          </form>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }

    .loading-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .form-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-header h3 {
      margin: 0 0 0.5rem 0;
      color: #1976d2;
      font-size: 1.5rem;
    }

    .form-header p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .form-errors {
      background-color: #ffebee;
      border: 1px solid #f44336;
      border-radius: 4px;
      padding: 1rem;
      margin: 1rem 0;
    }

    .form-errors h4 {
      margin: 0 0 0.5rem 0;
      color: #d32f2f;
      font-size: 1rem;
    }

    .form-errors ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .form-errors li {
      color: #d32f2f;
      margin-bottom: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
      gap: 1rem;
    }

    mat-form-field {
      margin-bottom: 1rem;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }

      .half-width {
        width: 100%;
      }
    }
  `],
})
export class UserStepComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _store = inject(WizardConfigStore);

  // Signals
  readonly isLoading = this._store.isLoading;
  readonly isSaving = this._store.isSavingUser;
  readonly userData = this._store.userData;

  // Form
  readonly userForm = this._fb.group<UserFormControls>({
    nroIdentificacion: this._fb.control('', [
      Validators.required,
      Validators.minLength(10)
    ]),
    firstName: this._fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    lastName: this._fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    email: this._fb.control('', [
      Validators.email
    ]),
    phone: this._fb.control('', [
      Validators.pattern(/^[\d\s\-\+\(\)]+$/)
    ])
  });

  // Computed signals
  readonly formErrors = computed(() => {
    const errors: string[] = [];
    const controls = this.userForm.controls;

    if (controls.nroIdentificacion.errors) {
      if (controls.nroIdentificacion.errors['required']) {
        errors.push('Número de identificación es requerido');
      }
      if (controls.nroIdentificacion.errors['minlength']) {
        errors.push('Número de identificación debe tener al menos 10 dígitos');
      }
    }

    if (controls.firstName.errors) {
      if (controls.firstName.errors['required']) {
        errors.push('Nombres son requeridos');
      }
      if (controls.firstName.errors['minlength']) {
        errors.push('Nombres deben tener al menos 2 caracteres');
      }
      if (controls.firstName.errors['maxlength']) {
        errors.push('Nombres no pueden exceder 50 caracteres');
      }
    }

    if (controls.lastName.errors) {
      if (controls.lastName.errors['required']) {
        errors.push('Apellidos son requeridos');
      }
      if (controls.lastName.errors['minlength']) {
        errors.push('Apellidos deben tener al menos 2 caracteres');
      }
      if (controls.lastName.errors['maxlength']) {
        errors.push('Apellidos no pueden exceder 50 caracteres');
      }
    }

    if (controls.email.errors && controls.email.errors['email']) {
      errors.push('Formato de correo inválido');
    }

    if (controls.phone.errors && controls.phone.errors['pattern']) {
      errors.push('Formato de teléfono inválido');
    }

    return errors;
  });

  constructor() {
    // Load existing user data when component initializes
    effect(() => {
      const data = this.userData();
      if (data) {
        this.userForm.patchValue({
          nroIdentificacion: data.nroIdentificacion,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || '',
          phone: data.phone || ''
        });
      }
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      try {
        const formValue = this.userForm.value;
        const userData = new UserData({
          nroIdentificacion: formValue.nroIdentificacion!,
          firstName: formValue.firstName!,
          lastName: formValue.lastName!,
          email: formValue.email || undefined,
          phone: formValue.phone || undefined
        });

        this._store.saveUserData(userData);
      } catch (error) {
        console.error('Error creating user data:', error);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
