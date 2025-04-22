import {Component, inject} from '@angular/core';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {DialogService} from "@core/services/dialog.service";
import {AddEditSeatComponent} from "@barber-shop/presentation/seat/add-edit-seat/add-edit-seat.component";
import {ListSeatUseCase} from "@barber-shop/domain/use-cases/seat/list-seat.use-case";

@Component({
  selector: 'app-seat',
  imports: [
    BreadcrumbComponent,
    MatDynamicCardComponent,
    ThemeButtonComponent
  ],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.scss',
})
export class SeatComponent {
  private _dialogSvc = inject(DialogService)
  private $listUseCase = inject(ListSeatUseCase)

  openAddEdit(data?: any){
    const ref = this._dialogSvc.open(AddEditSeatComponent, {
      data: {},
    })
    ref.subscribe(result=>{
      if(result && typeof result === 'object'){

      }
    })
  }

  private getList(){
    this.$listUseCase.execute({}).subscribe(response=>{

    })
  }
  ngOnInit(){
    this.getList()
  }

}
