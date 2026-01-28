import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { ToastrNotificationService } from 'acontplus-utils';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ListActionUseCase } from '@modules/seguridad/domain/use-cases/action/list-action.use-case';
import { ActionList } from '@modules/seguridad/domain/models/action.model';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UpdateActionUseCase } from '@modules/seguridad/domain/use-cases/action/update-action.use-case';
import { AddEditActionComponent } from '@modules/seguridad/presentation/actions/add-edit-action/add-edit-action.component';
import {
  AdvancedDialogService,
  MatDynamicCardComponent,
  Pagination,
} from 'acontplus-ui-components';

@Component({
  selector: 'app-actions',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    MatDynamicCardComponent,
  ],
  templateUrl: './actions.component.html',
  styles: `
    .table-container {
      position: relative;
      min-height: 200px;
      overflow: auto;
      height: calc(100vh - 180px);
    }
  `,
})
export class ActionsComponent {
  private $listUseCase = inject(ListActionUseCase);
  private $updateUseCase = inject(UpdateActionUseCase);

  private advancedDialogService = inject(AdvancedDialogService);
  private tS = inject(ToastrNotificationService);
  dataSource = signal<ActionList[]>([]);
  loading = false;

  displayedColumns = ['index', 'op', 'code', 'name', 'description', 'status'];

  pagination = signal(new Pagination());

  refresh() {
    this.getList();
  }

  private getList() {
    this.$listUseCase.execute({}).subscribe((response) => {
      console.log(response);
      this.dataSource.set(response.data);
    });
  }

  ngOnInit() {
    this.getList();
  }

  async onUpdate(permission: any) {
    const dialogRef = await this.advancedDialogService.openInWrapper(
      {
        title: 'Editar Acción',
        component: AddEditActionComponent,
        data: structuredClone(permission),
      },
      {
        size: 'lg',
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getList();
      }
    });
  }

  onisActive(permission: ActionList) {
    permission.isActive = !permission.isActive;
    this.$updateUseCase.execute(permission).subscribe((response) => {
      if (response.code == '0') {
        this.tS.show({
          type: 'warning',
          message: response.message,
        });
        return;
      }
      this.tS.show({
        type: 'success',
        message: response.message,
      });
    });
  }

  async openDialog() {
    let dialogRef = await this.advancedDialogService.open(
      AddEditActionComponent,
      {
        size: 'lg',
        data: {},
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getList();
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    // this.pagination.update((pag) => {
    //   return {
    //     ...pag,
    //     totalRecords: e.length,
    //     pageSize: e.pageSize,
    //     pageIndex: e.pageIndex,
    //   };
    // });
    this.refresh();
  }
}
