import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CartHeaderComponent } from '../cart-header/cart-header.component';
import { CartFooterComponent } from '../cart-footer/cart-footer.component';
import { CartItemsComponent } from '../cart-items/cart-items.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PosStoreService } from '@/store/pos-store.service';

@Component({
  selector: 'app-cart-popup',
  standalone: true,
  imports: [
    MatIconModule,
    OverlayscrollbarsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CartHeaderComponent,
    CartItemsComponent,
    CartFooterComponent
  ],
  templateUrl: './cart-popup.component.html',
  styleUrl: './cart-popup.component.scss'
})
export class CartPopupComponent {
  private posStoreSvc = inject(PosStoreService);

  orderItems = computed(() => this.posStoreSvc.state().orderItems);

   // Datos de vendedores
   vendedores = [
    { id: 1, name: 'Vendedor 1' },
    { id: 2, name: 'Vendedor 2' },
    { id: 3, name: 'Vendedor 3' }
  ];

  // Datos de mesas
  mesas = [
    { number: 'Mesa 1' },
    { number: 'Mesa 2' },
    { number: 'Mesa 3' }
  ];

  // Datos de tarifas
  tarifas = [
    { name: 'Tarifa A', rate: 0.12 },
    { name: 'Tarifa B', rate: 0.10 },
    { name: 'Tarifa C', rate: 0.08 }
  ];

  selectedVendedor = this.vendedores[0]; // Selección por defecto
  selectedMesa = this.mesas[0]; // Selección por defecto
  selectedTarifa = this.tarifas[0]; // Selección por defecto

  searchCliente = ''; // Buscador de clientes
  filteredClientes = [];

  cartItems:any[] = [

  ];

  // Función para buscar clientes
  onSearchCliente() {
    // Lógica para buscar el cliente en una lista
    console.log('Buscar cliente:', this.searchCliente);
  }

  // Aumentar la cantidad de un artículo
  increaseQty(item: any) {
    item.quantity++;
  }

  // Disminuir la cantidad de un artículo
  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  // Calcular el total de artículos
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Calcular el total a pagar incluyendo tarifa
  getTotalPrice(): number {
    const subtotal = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return subtotal + (subtotal * this.selectedTarifa.rate); // Incluyendo tarifa
  }

  // Función para finalizar la venta
  checkout() {
    console.log('Finalizando la venta...');
  }

}
