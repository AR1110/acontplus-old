import { Component, Input, Output, EventEmitter, signal, computed, inject, Signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatError } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipGrid, MatChipRow, MatChipInput, MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { ToUpperCaseDirective } from '@shared/directives/ui/to-upper-case.directive';
import { Canton } from '@modules/config/domain/models/wizard-config/canton.model';
import { AmbienteSri } from '@shared/models/ambiente-sri';
import { BACKSLASH, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export interface BodegaFormControls {
  descripcion: FormControl<string | null>;
  direccion: FormControl<string | null>;
  telefono: FormControl<string | null>;
}

export interface PtoEmiFormControls {
  ptoEmi: FormControl<string | null>;
  ambiente: FormControl<string | null>;
}

export interface EstabFormControls {
  canton: FormControl<string | null>;
  estab: FormControl<string | null>;
  nombreComercial: FormControl<string | null>;
  dirEstablecimiento: FormControl<string | null>;
  telefono: FormControl<string | null>;
  correo: FormControl<string | null>;
  ptosEmi: FormArray<FormGroup<PtoEmiFormControls>>;
  hasInventory: FormControl<boolean | null>;
  bodegas: FormArray<FormGroup<BodegaFormControls>>;
}

@Component({
  selector: 'app-establishment-step',
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
    MatSelectModule,
    MatChipGrid,
    MatChipRow,
    MatChipInput,
    ToUpperCaseDirective,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <form [formGroup]="estabForm" (ngSubmit)="onSave()">
          <!-- Basic Establishment Info -->
          <div class="form-section">
            <h3>Información del Establecimiento</h3>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Cantón</mat-label>
                <mat-select formControlName="canton">
                  @for (canton of cantones(); track canton.codigo) {
                    <mat-option [value]="canton.codigo">
                      {{ canton.descripcion }}
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Establecimiento</mat-label>
                <input
                  matInput
                  formControlName="estab"
                  placeholder="001"
                  maxlength="3"
                  toUpperCase
                />
                @if (estabForm.get('estab')?.hasError('required')) {
                  <mat-error>El establecimiento es requerido</mat-error>
                }
                @if (estabForm.get('estab')?.hasError('minlength')) {
                  <mat-error>Debe tener 3 caracteres</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre Comercial</mat-label>
                <input
                  matInput
                  formControlName="nombreComercial"
                  placeholder="Ingrese nombre comercial"
                  toUpperCase
                />
                @if (estabForm.get('nombreComercial')?.hasError('required')) {
                  <mat-error>El nombre comercial es requerido</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Dirección del Establecimiento</mat-label>
                <input
                  matInput
                  formControlName="dirEstablecimiento"
                  placeholder="Ingrese dirección"
                  toUpperCase
                />
                @if (estabForm.get('dirEstablecimiento')?.hasError('required')) {
                  <mat-error>La dirección es requerida</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Contact Information -->
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Teléfonos</mat-label>
                <mat-chip-grid #telephoneGrid>
                  @for (telephone of telephones(); track trackByTelephone($index, telephone)) {
                    <mat-chip-row
                      (removed)="removeTelephone(telephone)"
                      (edited)="editTelephone(telephone, $event)"
                    >
                      {{ telephone }}
                      <button matChipRemove>
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </mat-chip-row>
                  }
                  <input
                    placeholder="Nuevo teléfono..."
                    [matChipInputFor]="telephoneGrid"
                    (matChipInputTokenEnd)="addTelephone($event)"
                  />
                </mat-chip-grid>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Correos Electrónicos</mat-label>
                <mat-chip-grid #emailGrid>
                  @for (email of emails(); track trackByEmail($index, email)) {
                    <mat-chip-row
                      (removed)="removeEmail(email)"
                      (edited)="editEmail(email, $event)"
                    >
                      {{ email }}
                      <button matChipRemove>
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </mat-chip-row>
                  }
                  <input
                    placeholder="Nuevo correo..."
                    [matChipInputFor]="emailGrid"
                    (matChipInputTokenEnd)="addEmail($event)"
                  />
                </mat-chip-grid>
              </mat-form-field>
            </div>
          </div>

          <!-- Points of Emission -->
          <div class="form-section">
            <div class="section-header">
              <h3>Puntos de Emisión</h3>
              <button
                type="button"
                mat-icon-button
                color="primary"
                (click)="addPtoEmi()"
                [disabled]="ptosEmi.length >= 5"
              >
                <mat-icon>add</mat-icon>
              </button>
            </div>

            <div
              formArrayName="ptosEmi"
              class="form-array-container"
            >
              @for (ptoEmi of ptosEmi.controls; track trackByPtoEmi($index); let i = $index) {
                <div
                  [formGroupName]="i"
                  class="form-array-item"
                >
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Punto de Emisión</mat-label>
                      <input
                        matInput
                        formControlName="ptoEmi"
                        placeholder="001"
                        maxlength="3"
                        toUpperCase
                      />
                      @if (ptoEmi.get('ptoEmi')?.hasError('required')) {
                        <mat-error>Punto de emisión requerido</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Ambiente</mat-label>
                      <mat-select formControlName="ambiente">
                        @for (ambiente of ambientes(); track ambiente.code) {
                          <mat-option [value]="ambiente.code">
                            {{ ambiente.name }}
                          </mat-option>
                        }
                      </mat-select>
                      @if (ptoEmi.get('ambiente')?.hasError('required')) {
                        <mat-error>Ambiente requerido</mat-error>
                      }
                    </mat-form-field>

                    <button
                      type="button"
                      mat-icon-button
                      color="warn"
                      (click)="removePtoEmi(i)"
                      [disabled]="ptosEmi.length <= 1"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Warehouses -->
          <div class="form-section">
            <div class="section-header">
              <h3>Bodegas</h3>
              <button
                type="button"
                mat-icon-button
                color="primary"
                (click)="addBodega()"
              >
                <mat-icon>add</mat-icon>
              </button>
            </div>

            <div
              formArrayName="bodegas"
              class="form-array-container"
            >
              @for (bodega of bodegas.controls; track trackByBodega($index); let i = $index) {
                <div
                  [formGroupName]="i"
                  class="form-array-item"
                >
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Descripción</mat-label>
                      <input
                        matInput
                        formControlName="descripcion"
                        placeholder="Nombre de la bodega"
                        toUpperCase
                      />
                      @if (bodega.get('descripcion')?.hasError('required')) {
                        <mat-error>Descripción requerida</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Dirección</mat-label>
                      <input
                        matInput
                        formControlName="direccion"
                        placeholder="Dirección de la bodega"
                        toUpperCase
                      />
                      @if (bodega.get('direccion')?.hasError('required')) {
                        <mat-error>Dirección requerida</mat-error>
                      }
                    </mat-form-field>

                    <button
                      type="button"
                      mat-icon-button
                      color="warn"
                      (click)="removeBodega(i)"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Teléfono</mat-label>
                      <input
                        matInput
                        formControlName="telefono"
                        placeholder="Teléfono de la bodega"
                      />
                    </mat-form-field>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="!estabForm.valid || loading()"
            >
              @if (loading()) {
                <mat-icon>hourglass_empty</mat-icon>
              }
              {{ loading() ? 'Guardando...' : 'Guardar Establecimiento' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-section {
      margin-bottom: 2rem;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h3 {
      margin: 0;
      color: #1976d2;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      align-items: flex-start;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .form-array-container {
      margin-top: 1rem;
    }

    .form-array-item {
      padding: 1rem;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      margin-bottom: 1rem;
      background-color: #fafafa;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    mat-form-field {
      margin-bottom: 0.5rem;
    }

    mat-chip-grid {
      width: 100%;
    }
  `],
})
export class EstablishmentStepComponent {
  @Input() estabForm!: FormGroup<EstabFormControls>;
  @Input() cantones!: Signal<Canton[]>;
  @Input() ambientes!: Signal<AmbienteSri[]>;
  @Output() save = new EventEmitter<void>();

  loading = signal(false);
  emails = signal<string[]>([]);
  telephones = signal<string[]>([]);

  readonly separatorKeysCodes = [ENTER, BACKSLASH] as const;
  readonly addOnBlur = true;

  private readonly _fb = inject(FormBuilder);
  private readonly _announcer = inject(LiveAnnouncer);

  get bodegas(): FormArray {
    return this.estabForm.get('bodegas') as FormArray;
  }

  get ptosEmi(): FormArray {
    return this.estabForm.get('ptosEmi') as FormArray;
  }

  // Computed signals for validation
  readonly formErrors = computed(() => {
    const errors: string[] = [];

    if (!this.estabForm.valid) {
      errors.push('El formulario tiene errores de validación');
    }

    if (this.ptosEmi.length === 0) {
      errors.push('Debe agregar al menos un punto de emisión');
    }

    return errors;
  });

  // TrackBy functions
  trackByEmail(index: number, email: string): string {
    return email;
  }

  trackByTelephone(index: number, telephone: string): string {
    return telephone;
  }

  trackByBodega(index: number): number {
    return index;
  }

  trackByPtoEmi(index: number): number {
    return index;
  }

  // Form array management
  addBodega(): void {
    this.bodegas.push(this.newBodega());
  }

  removeBodega(index: number): void {
    this.bodegas.removeAt(index);
  }

  addPtoEmi(): void {
    this.ptosEmi.push(this.newPtoEmi());
  }

  removePtoEmi(index: number): void {
    this.ptosEmi.removeAt(index);
  }

  // Form factory methods
  private newBodega(): FormGroup {
    return this._fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
      direccion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
      telefono: [''],
    });
  }

  private newPtoEmi(): FormGroup {
    return this._fb.group({
      ptoEmi: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      ambiente: ['', Validators.required],
    });
  }

  // Chip management
  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.emails.update((prev) => [...prev, value]);
      event.chipInput!.clear();
    }
  }

  removeEmail(value: string): void {
    const index = this.emails().indexOf(value);
    if (index >= 0) {
      this.emails.update((prev) => prev.filter((_, i) => i !== index));
      this._announcer.announce(`Removed ${value}`);
    }
  }

  editEmail(email: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeEmail(email);
    } else {
      const index = this.emails().indexOf(email);
      if (index >= 0) {
        this.emails.update((prev) =>
          prev.map((e, i) => (i === index ? value : e)),
        );
      }
    }
  }

  addTelephone(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.telephones.update((prev) => [...prev, value]);
      event.chipInput!.clear();
    }
  }

  removeTelephone(value: string): void {
    const index = this.telephones().indexOf(value);
    if (index >= 0) {
      this.telephones.update((prev) => prev.filter((_, i) => i !== index));
      this._announcer.announce(`Removed ${value}`);
    }
  }

  editTelephone(telephone: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeTelephone(telephone);
    } else {
      const index = this.telephones().indexOf(telephone);
      if (index >= 0) {
        this.telephones.update((prev) =>
          prev.map((t, i) => (i === index ? value : t)),
        );
      }
    }
  }

  onSave(): void {
    if (this.estabForm.valid) {
      this.loading.set(true);
      this.save.emit();
      // Reset loading after a delay to show feedback
      setTimeout(() => this.loading.set(false), 1000);
    }
  }
}
