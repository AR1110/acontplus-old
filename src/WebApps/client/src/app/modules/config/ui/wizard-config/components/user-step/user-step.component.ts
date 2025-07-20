import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatError } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';

export interface UserFormControls {
  nroIdentificacion: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
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
        <form [formGroup]="userForm" (ngSubmit)="onSave()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Número de Identificación</mat-label>
              <input
                matInput
                formControlName="nroIdentificacion"
                placeholder="Ingrese número de identificación"
                toUpperCase
              />
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
              />
                             @if (userForm.get('firstName')?.hasError('required')) {
                 <mat-error>Los nombres son requeridos</mat-error>
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
              />
                             @if (userForm.get('lastName')?.hasError('required')) {
                 <mat-error>Los apellidos son requeridos</mat-error>
               }
               @if (userForm.get('lastName')?.hasError('minlength')) {
                 <mat-error>Los apellidos deben tener al menos 2 caracteres</mat-error>
               }
               @if (userForm.get('lastName')?.hasError('maxlength')) {
                 <mat-error>Los apellidos no pueden exceder 50 caracteres</mat-error>
               }
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="!userForm.valid || loading()"
            >
                             @if (loading()) {
                 <mat-icon>hourglass_empty</mat-icon>
               }
               {{ loading() ? 'Guardando...' : 'Guardar Usuario' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    mat-form-field {
      margin-bottom: 1rem;
    }
  `],
})
export class UserStepComponent {
  @Input() userForm!: FormGroup<UserFormControls>;
  @Output() save = new EventEmitter<void>();

  loading = signal(false);

  readonly formErrors = computed(() => {
    const errors: string[] = [];
    const firstName = this.userForm.get('firstName');
    const lastName = this.userForm.get('lastName');

    if (firstName?.errors) {
      if (firstName.errors['required']) errors.push('Nombres son requeridos');
      if (firstName.errors['minlength']) errors.push('Nombres muy cortos');
      if (firstName.errors['maxlength']) errors.push('Nombres muy largos');
    }

    if (lastName?.errors) {
      if (lastName.errors['required']) errors.push('Apellidos son requeridos');
      if (lastName.errors['minlength']) errors.push('Apellidos muy cortos');
      if (lastName.errors['maxlength']) errors.push('Apellidos muy largos');
    }

    return errors;
  });

  onSave(): void {
    if (this.userForm.valid) {
      this.loading.set(true);
      this.save.emit();
      // Reset loading after a delay to show feedback
      setTimeout(() => this.loading.set(false), 1000);
    }
  }
}
