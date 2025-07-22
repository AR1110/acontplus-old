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
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

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
  templateUrl: './establishment-step.component.html',
  styleUrls: ['./establishment-step.component.scss'],
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
  private readonly _toasterService = inject(ToastrNotificationService);

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
    // Bodegas validation
    if (this.bodegas.length > 0 && !this.bodegas.valid) {
      this.bodegas.markAllAsTouched();
      this._toasterService.show({
        type: 'warning',
        message: 'Revise que los datos de las bodegas sean correctos',
      });
      return;
    }
    // Puntos de emisión validation
    if (this.ptosEmi.length === 0) {
      this._toasterService.show({
        type: 'warning',
        message: 'Ingrese al menos un punto de emisión',
      });
      return;
    }
    if (!this.ptosEmi.valid) {
      this.ptosEmi.markAllAsTouched();
      this._toasterService.show({
        type: 'warning',
        message: 'Revise que los datos de los puntos de emisión sean correctos',
      });
      return;
    }
    if (this.estabForm.valid) {
      this.loading.set(true);
      this.save.emit();
      setTimeout(() => this.loading.set(false), 1000);
    }
  }
}
