import {Component, inject, Input, model, signal} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {GetFilterDataOrderUseCase} from "@domain/use-cases/order/get-filter-data-order.use-case";
import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";

@Component({
  selector: 'app-table-orders',
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTabsModule
  ],
  templateUrl: './table-orders.component.html',
  styleUrl: './table-orders.component.scss'
})
export class TableOrdersComponent {
  private $getFilterDataUseCase = inject(GetFilterDataOrderUseCase)

  @Input({ required: true }) dataSearch = {} as any;


  selectedStatus = model('');
  rooms = signal<any[]>([])
  tables = signal<any[]>([])
    selectedIndex = signal(0)


  ngOnInit() {
    this.selectedStatus.set(this.dataSearch.selectedStatus);
    console.log(this)
    this.$getFilterDataUseCase.execute().subscribe((response) => {
      this.rooms.set(response.tablesGroup);
      console.log(this.rooms())
     // this.users = response.users;
     // this.getOrders();
    });
  }

  handleFloorChange($event:any){
    console.log($event)
    const tables = this.rooms().flatMap(r=>r.tables)

    const tablesFiltered= tables.filter(t=>t.roomId===this.dataSearch.roomId);
    this.tables.set([])
    this.tables.set(tablesFiltered)
    console.log(tablesFiltered)

    this.selectedIndex.set(0)


  }

}
