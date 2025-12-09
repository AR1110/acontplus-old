import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { Button, DynamicCard } from '@acontplus/ng-components';
import { DialogService } from '@core/services/dialog.service';
import { AddEditSeatComponent } from '@barber-shop/presentation/seat/add-edit-seat/add-edit-seat.component';
import { ListSeatUseCase } from '@barber-shop/application/use-cases/seat/list-seat.use-case';
import { SeatList } from '@barber-shop/domain/models/seat.model';

@Component({
  selector: 'app-seat',
  imports: [BreadcrumbComponent, DynamicCard, Button],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.scss',
})
export class SeatComponent implements OnInit {
  private _dialogSvc = inject(DialogService);
  private $listUseCase = inject(ListSeatUseCase);

  dataSource = signal<SeatList[]>([]);

  openAddEdit(data?: SeatList) {
    const ref = this._dialogSvc.open(AddEditSeatComponent, {
      data: structuredClone(data) || {},
      size: 'sm',
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.refresh();
      }
    });
  }

  private getList() {
    this.$listUseCase.execute({}).subscribe((response) => {
      this.dataSource.set(response.data);
      console.log(response.data);
    });
  }
  refresh() {
    this.getList();
  }
  ngOnInit() {
    this.getList();
  }
}
