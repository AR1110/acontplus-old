import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ThemeButtonComponent } from '@shared/components/theme-button/theme-button.component';
import { REPORT_FORMAT } from '@core/constants/global.constants';

@Component({
  selector: 'app-report-buttons',
  template: `
    <app-theme-button [variant]="getButtonColor()"
      [text]="text()"
      [icon]="getFileIcon()"
      (handleClick)="handleClick()"
     />
  `,
  styles: [``],
  imports: [ThemeButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportButtonsComponent {
  fileType = input.required<REPORT_FORMAT>();
  text = input.required<string>();
  exportReport = output<REPORT_FORMAT>();

  getButtonColor() {
    switch (this.fileType()) {
      case 'pdf':
        return 'danger';
      case 'excel':
        return 'success';
      case 'word':
        return 'primary';
      case 'image':
        return 'info';
      case 'xml':
        return 'warning';
      case 'csv':
        return 'success';
      case 'mhtml':
        return 'secondary';
      case 'html':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getFileIcon(): string {
    switch (this.fileType()) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'excel':
        return 'table_view';
      case 'word':
        return 'description';
      case 'image':
        return 'image';
      case 'xml':
        return 'code';
      case 'csv':
        return 'grid_on';
      case 'mhtml':
        return 'web';
      case 'html':
        return 'html';
      default:
        return 'download';
    }
  }

  handleClick(): void {
    this.exportReport.emit(this.fileType());
  }
}
