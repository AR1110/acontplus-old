import { Component } from '@angular/core';
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wizard-config',
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    BreadcrumbComponent,
    ReactiveFormsModule,
    MatStepLabel,
  ],
  templateUrl: './wizard-config.component.html',
  styles: ``,
})
export class WizardConfigComponent {
  isLinear = false;
  estabForm = new FormGroup({});

  saveEstab() {}
}
