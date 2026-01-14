import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { PrinterRead } from '@modules/config/data/models/printer.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { PrinterAddEditModal } from '@modules/config/ui/printer-page/printer-add-edit-modal/printer-add-edit-modal';
import Swal from 'sweetalert2';
import { Button, AdvancedDialogService, DataGrid, DataGridColumn } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { PRINTER_HTTP_TOKEN } from '@modules/config/data/config-token';

@Component({
  selector: 'app-printer-page',
  imports: [FormsModule, MatSlideToggleModule, BreadcrumbComponent, Button, DataGrid],
  templateUrl: './printer-page.html',
  styles: `
    :host ::ng-deep .data-grid {
      height: 500px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrinterPage implements OnInit {
  private readonly printerService = inject(PRINTER_HTTP_TOKEN);
  private readonly dialogSvc = inject(AdvancedDialogService);
  private readonly notificationSvc = inject(NotificationService);

  printers = signal<PrinterRead[]>([]);
  isLoadingResults = signal(false);

  columns: DataGridColumn[] = [
    {
      header: 'Nro.',
      field: 'index',
      width: '60px',
      sortable: false,
    },
    {
      header: 'Op.',
      field: 'actions',
      sortable: false,
    },
    {
      header: 'Estab.',
      field: 'estab',
      sortable: true,
    },
    {
      header: 'Tipo',
      field: 'printerTypeName',
      sortable: true,
    },
    {
      header: 'Impresora',
      field: 'name',
      sortable: true,
    },
    {
      header: 'Default',
      field: 'default',
      sortable: true,
    },
    {
      header: 'Equipo',
      field: 'machine',
      sortable: true,
    },
    {
      header: 'Servidor',
      field: 'server',
      sortable: true,
    },
    {
      header: 'IP',
      field: 'ipAddress',
      sortable: true,
    },
    {
      header: 'Estado',
      field: 'status',
      sortable: false,
    },
  ];

  add(): void {
    void this.openModalNewOrEdit();
  }

  edit(item: PrinterRead): void {
    void this.openModalNewOrEdit(item);
  }

  async openModalNewOrEdit(item?: PrinterRead): Promise<void> {
    const isEdit = !!item;
    const ref = await this.dialogSvc.openInWrapper(
      {
        component: PrinterAddEditModal,
        title: isEdit ? 'Editar Impresora' : 'Nueva Impresora',
        icon: isEdit ? 'edit' : 'print',
        showCloseButton: true,
        data: {
          data: structuredClone(item) ?? {},
          printers: structuredClone(this.printers()),
        },
      },
      {
        size: 'xl',
      },
    );

    ref.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getPrinters();
      }
    });
  }

  getPrinters(): void {
    if (this.isLoadingResults()) return;

    this.isLoadingResults.set(true);
    this.printerService.getPrinters().subscribe({
      next: (response) => {
        this.isLoadingResults.set(false);
        this.printers.set(response.printers);
      },
      error: (err: unknown) => {
        this.isLoadingResults.set(false);
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.getPrinters();
  }

  refresh(): void {
    this.getPrinters();
  }

  async askToDelete(item: PrinterRead): Promise<void> {
    try {
      const { isConfirmed } = await Swal.fire({
        title: '¿Está seguro de eliminar esta impresora?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false,
      });

      if (isConfirmed) {
        this.printerService.removePrinter(item.id).subscribe((response) => {
          if (response.code === '0') {
            this.notificationSvc.warning({ message: response.message });
          }
          if (response.code === '1') {
            this.notificationSvc.success({ message: response.message });
            this.getPrinters();
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  updateStatus(item: PrinterRead): void {
    this.printerService.updateStatus(item.id, item).subscribe((response) => {
      if (response.code === '0') {
        this.notificationSvc.warning({ message: response.message });
      }
      if (response.code === '1') {
        this.notificationSvc.success({ message: response.message });
        this.getPrinters();
      }
    });
  }
}
