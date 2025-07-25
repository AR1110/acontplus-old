import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { UserData } from '@modules/config/domain/models/wizard-config/value-objects/user-data.vo';
import { WizardConfigStore } from '@modules/config/application/store/wizard-config.store';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { MatFormField, MatInput, MatLabel, MatError } from '@angular/material/input';
import { Component, inject, computed, effect, output } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

export interface UserFormControls {
  nroIdentificacion: FormControl<string | null>;
  username: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-user-step',
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
  templateUrl: './user-step.component.html',
  styleUrls: ['./user-step.component.scss'],
})
export class UserStepComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _store = inject(WizardConfigStore);

  userSaved = output();

  // Show/hide password toggles
  showPassword = false;
  showConfirmPassword = false;

  // Track if the form has been submitted
  submitted = false;

  // Signals
  readonly isLoading = this._store.isLoading;
  readonly isSaving = this._store.isSavingUser;
  readonly userData = this._store.userData;

  // Form
  readonly userForm = this._fb.group<UserFormControls>(
    {
      nroIdentificacion: this._fb.control('', [Validators.required, Validators.minLength(10)]),
      username: this._fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ]),
      firstName: this._fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      lastName: this._fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      email: this._fb.control('', [Validators.email]),
      phone: this._fb.control('', [Validators.pattern(/^[\d\s\-+()]+$/)]),
      password: this._fb.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this._fb.control('', [Validators.required]),
    },
    { validators: [passwordsMatchValidator] },
  );

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

    if (controls.username.errors) {
      if (controls.username.errors['required']) {
        errors.push('Nombre de usuario es requerido');
      }
      if (controls.username.errors['minlength']) {
        errors.push('Nombre de usuario debe tener al menos 3 caracteres');
      }
      if (controls.username.errors['maxlength']) {
        errors.push('Nombre de usuario no puede exceder 20 caracteres');
      }
      if (controls.username.errors['pattern']) {
        errors.push('Nombre de usuario solo puede contener letras, números y guiones bajos');
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

    if (controls.password.errors) {
      if (controls.password.errors['required']) {
        errors.push('Contraseña es requerida');
      }
      if (controls.password.errors['minlength']) {
        errors.push('Contraseña debe tener al menos 6 caracteres');
      }
    }
    if (controls.confirmPassword.errors) {
      if (controls.confirmPassword.errors['required']) {
        errors.push('Confirmar contraseña es requerido');
      }
    }
    if (this.userForm.errors?.['passwordsMismatch']) {
      errors.push('Las contraseñas no coinciden');
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
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || '',
          phone: data.phone || '',
        });
      }
    });
  }

  onSave(): void {
    this.submitted = true;
    if (this.userForm.valid) {
      try {
        const formValue = this.userForm.value;
        const userData = new UserData({
          nroIdentificacion: formValue.nroIdentificacion!,
          username: formValue.username!,
          firstName: formValue.firstName!,
          lastName: formValue.lastName!,
          email: formValue.email || undefined,
          phone: formValue.phone || undefined,
          password: formValue.password!,
        });
        this._store.saveUserData(userData);
      } catch (error) {
        console.error('Error creating user data:', error);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}

// Custom validator for matching passwords
function passwordsMatchValidator(control: AbstractControl) {
  const group = control as FormGroup;
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}
