import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PromotionsItemComponent } from './promotions-item/promotions-item.component';
import { PromotionService } from '@/services/promotion.service';
import { MainStoreService } from '@/store/main-store.service';
import { PosStoreService } from '@/store/pos-store.service';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    PromotionsItemComponent
  ],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss'
})
export class PromotionsComponent {

  private promotionSvc = inject(PromotionService)
  private mainStoreSvc = inject(MainStoreService)
  private posStoreSvc = inject(PosStoreService)

  promotions = signal([
    {
      "id": 1,
      "codigo": "PROMO001",
      "descripcion": "Martes Loco - Descuento del 50% en toda la tienda",
      "img": "https://example.com/img/martes-loco.jpg",
      expanded: false
    },
    {
      "id": 2,
      "codigo": "PROMO002",
      "descripcion": "Viernes de Descuentos - 30% en productos seleccionados",
      "img": "https://example.com/img/viernes-descuentos.jpg",
      expanded: false
    },
    {
      "id": 3,
      "codigo": "PROMO003",
      "descripcion": "Día de la Madre - Regalo sorpresa por compras mayores a $50",
      "img": "https://example.com/img/dia-madre.jpg",
      expanded: false
    },
    {
      "id": 4,
      "codigo": "PROMO004",
      "descripcion": "2x1 en Jueves - Compra uno y llévate otro gratis",
      "img": "https://example.com/img/jueves-2x1.jpg",
      expanded: false
    },
    {
      "id": 5,
      "codigo": "PROMO005",
      "descripcion": "Domingo Familiar - 20% de descuento en alimentos y bebidas",
      "img": "https://example.com/img/domingo-familiar.jpg",
      expanded: false
    },
    {
      "id": 6,
      "codigo": "PROMO006",
      "descripcion": "Semana del Ahorro - Ofertas en toda la tienda durante una semana",
      "img": "https://example.com/img/semana-ahorro.jpg",
      expanded: false
    },
    {
      "id": 7,
      "codigo": "PROMO007",
      "descripcion": "Súper Sábado - Descuentos especiales en tecnología",
      "img": "https://example.com/img/super-sabado.jpg",
      expanded: false
    },
    {
      "id": 8,
      "codigo": "PROMO008",
      "descripcion": "Finde de Rebajas - Hasta 40% de descuento en ropa",
      "img": "https://example.com/img/finde-rebajas.jpg",
      expanded: false
    },
    {
      "id": 9,
      "codigo": "PROMO009",
      "descripcion": "Feria de Precios - Precios especiales en productos seleccionados",
      "img": "https://example.com/img/feria-precios.jpg",
      expanded: false
    },
    {
      "id": 10,
      "codigo": "PROMO010",
      "descripcion": "Días de Oportunidades - Descuentos sorpresa cada día",
      "img": "https://example.com/img/dias-oportunidades.jpg",
      expanded: false
    }
  ])

  setLoading(isLoading: boolean) {
    this.posStoreSvc.state.update(e => ({
      ...e,
      isLoading
    }))
  }

  private getPromotions() {
    let params = {
      codEstab: this.mainStoreSvc.state().codEstab
    }
    this.setLoading(true)
    this.promotionSvc.getPromotions(params).subscribe({
      next: response => {
        this.setLoading(false)

      },
      error: err => {
        this.setLoading(false)

      }
    })
  }

  ngOnInit(){
    console.log('load prmotions')
    this.getPromotions()
  }


  toggleNode(node: any) {
    node.expanded = !node.expanded
    this.promotions.update(e => {
      return e.map(item => {
        return {
          ...item,
          expanded: item.id === node.id && node.expanded
        }
      })
    })
  }

}
