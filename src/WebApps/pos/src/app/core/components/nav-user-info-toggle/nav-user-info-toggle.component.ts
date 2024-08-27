import { MainStoreService } from '@/store/main-store.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-user-info-toggle',
  standalone: true,
  imports: [
    OverlayModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './nav-user-info-toggle.component.html',
  styleUrl: './nav-user-info-toggle.component.scss'
})
export class NavUserInfoToggleComponent {
  private mainStore = inject(MainStoreService)
  activatedRoute = inject(ActivatedRoute)
  isOverlayOpen = signal(false);

  estabs = computed(()=>this.mainStore.state().establecimientos);
  puntosEmision =  computed(()=>this.mainStore.state().puntosEmision);
  bodegas =  computed(()=>this.mainStore.state().bodegas);

  entidadName = computed(() => this.mainStore.state().entidadName);
  estabName = computed(() => this.mainStore.state().dataEstab?.nombreComercial)
  data = model(this.mainStore.state())

  ngOnInit() {
  }
}
