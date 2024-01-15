import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ModalService } from '@core/services/modal.service';
import { TechSpecDialogComponent } from '@modules/technical-support/components/tech-spec-dialog/tech-spec-dialog.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-technical-support-page',
  standalone: true,
  imports: [BreadcrumbComponent, NgbNavModule],
  templateUrl: './technical-support-page.component.html',
  styleUrl: './technical-support-page.component.scss'
})
export class TechnicalSupportPageComponent {
  active = 1;
  /**
   *
   */
  constructor(private modalRef: ModalService) {
  }
  openTechSpec() {
    this.modalRef.openModalCustom(TechSpecDialogComponent, { centered: true, size: 'xl' })
  }
}
