import { MainStoreService } from '@domain/services/main-store.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, inject, input, model, signal, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-nav-user-info-toggle',
    imports: [
        OverlayModule,
        MatIconModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule
    ],
    templateUrl: './nav-user-info-toggle.component.html',
    styleUrl: './nav-user-info-toggle.component.scss'
})
export class NavUserInfoToggleComponent {
  private mainStore = inject(MainStoreService)
  activatedRoute = inject(ActivatedRoute)
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild('trigger') trigger!: CdkOverlayOrigin;

  isOfPos = input(false)

  isOverlayOpen = signal(false);

  estabs = computed(()=>this.mainStore.state().establecimientos);
  puntosEmision =  computed(()=>this.mainStore.state().puntosEmision);
  bodegas =  computed(()=>this.mainStore.state().bodegas);

  // entidadName = computed(() => this.mainStore.state().entidadName);
  // estabName = computed(() => this.mainStore.state().dataEstab?.nombreComercial)

  entidadName = signal("");
   estabName = signal("")
  data = model(this.mainStore.state())
  isMobile: boolean = false;

  ngOnInit(): void {
    // Observa los cambios en el tamaño de la pantalla
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.setText();
      });
  }

  private setText(): void {
    const maxLength = this.isMobile ? 15 : 250; // Ajusta el tamaño máximo del texto para móvil o escritorio
    this.entidadName.set(this.truncateText(this.mainStore.state().entidadName, maxLength))
    this.estabName.set(this.truncateText(this.mainStore.state().dataEstab?.nombreComercial, maxLength))
  }

  private truncateText(text: string | undefined, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

}
