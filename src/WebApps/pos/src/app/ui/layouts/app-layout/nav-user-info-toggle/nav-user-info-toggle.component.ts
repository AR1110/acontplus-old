
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  Component,
  computed,
  inject,
  input,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DialogService } from '@/domain/services/dialog.service';
import { InfoCompanyComponent } from '../info-company/info-company.component';
import {truncateText} from "@domain/utils/utils";
import {LayoutStore} from "@ui/store/layout.store";

@Component({
  selector: 'app-nav-user-info-toggle',
  imports: [
    OverlayModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './nav-user-info-toggle.component.html',
  styleUrl: './nav-user-info-toggle.component.scss',
})
export class NavUserInfoToggleComponent {
  private $layoutStore = inject(LayoutStore)
  private dialogSvc = inject(DialogService);
  private breakpointObserver = inject(BreakpointObserver);

  estabs = computed(() => this.$layoutStore.establecimientos());
  puntosEmision = computed(() => this.$layoutStore.puntosEmision());
  bodegas = computed(() => this.$layoutStore.bodegas());

  entidadName = signal('');
  estabName = signal('');
  data = model(this.$layoutStore);
  isMobile: boolean = false;

  ngOnInit(): void {
    // Observa los cambios en el tamaño de la pantalla
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
        this.setText();
      });
  }

  private setText(): void {
    const maxLength = this.isMobile ? 15 : 250; // Ajusta el tamaño máximo del texto para móvil o escritorio
    this.entidadName.set(
      truncateText(this.$layoutStore.entidadName(), maxLength)
    );
    this.estabName.set(
      truncateText(
        this.$layoutStore.dataEstab().nombreComercial,
        maxLength
      )
    );
  }



  showInfoCompany() {
    this.dialogSvc.open(InfoCompanyComponent, {
      size: 'md',
    });
  }
}
