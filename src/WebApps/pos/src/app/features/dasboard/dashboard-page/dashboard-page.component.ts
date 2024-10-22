import { Component, inject, model, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MainStoreService } from '@/store/main-store.service';
import { WidgetComponent } from '../components/widget/widget.component';
import { MatButtonModule } from '@angular/material/button';
import { DashboardStore } from '../store/dashboard.store';
import { MatMenuModule } from '@angular/material/menu';


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
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    WidgetComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private router = inject(Router)
  private mainStoreSvc = inject(MainStoreService)
    dashboardStore = inject(DashboardStore)


  anios = signal(getAnios())

  sales = signal<any[]>([])
  bestSellingProduct = signal<any[]>([])

  dataSearch = model({
    anio: new Date().getFullYear()
  })

  onLoad(){
    let estabId = this.mainStoreSvc.state().establecimientoId;
    if (!(estabId)){
      console.error("estab id", estabId)
      return
    }
    this.dashboardStore.getStats(estabId)
  }
  ngOnInit(): void {
    let estabId = this.mainStoreSvc.state().establecimientoId;
    if (!(estabId)){
      console.error("estab id", estabId)
      return
    }
    this.dashboardStore.getStats(estabId)
  }

  refresh(){
    this.onLoad()
  }
  navigateToPos() {
    this.router.navigate(['pos'])
  }

}
