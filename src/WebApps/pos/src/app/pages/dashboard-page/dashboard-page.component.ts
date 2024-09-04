import { Component, inject, model, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '@/services/order.service';
import { MainStoreService } from '@/store/main-store.service';
import { BestSellingProductStatsComponent } from './components/best-selling-product-stats/best-selling-product-stats.component';
import { SaleStatsComponent } from './components/sale-stats/sale-stats.component';
import { FormsModule } from '@angular/forms';


function getAnios() {
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
}
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    SaleStatsComponent,
    BestSellingProductStatsComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private router = inject(Router)
  private orderSvc = inject(OrderService)
  private mainStoreSvc = inject(MainStoreService)


  anios = signal(getAnios())

  sales = signal<any[]>([])
  bestSellingProduct = signal<any[]>([])

  dataSearch = model({
    anio: new Date().getFullYear()
  })

  onLoad(){
    let {
      codEstab,
      establecimientoId
    } = this.mainStoreSvc.state();

    let params = {
      estabId: establecimientoId,
      anio: this.dataSearch().anio
    }
    this.orderSvc.getStats(params).subscribe(response => {
      //sales
      this.sales.set(response.sales);
      //products mas vendidos
      this.bestSellingProduct.set(response.productsTop);


    })
  }
  ngOnInit(): void {
    if (!(this.mainStoreSvc.state().establecimientoId>0)){
      console.error("estab id", this.mainStoreSvc.state().establecimientoId)
      return
    }
    this.onLoad()
  }

  refresh(){
    this.onLoad()
  }
  navigateToPos() {
    console.log(this)
    this.router.navigate(['pos'])
  }

}
