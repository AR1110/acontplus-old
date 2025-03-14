import { inject, Injectable, signal, DestroyRef } from '@angular/core';
import { UserRoleStateService } from './user-role-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; // Angular 16+

@Injectable({
  providedIn: 'root',
})
export class UserRoleStateManager {
  private readonly userRoleService = inject(UserRoleStateService);
  private readonly destroyRef = inject(DestroyRef); // Manejo automático de suscripciones

  // Signals con nombres más descriptivos
  readonly canCancel = signal(false);
  readonly canGenerateReport = signal(false);
  readonly canCreate = signal(false);

  constructor() {
    this.initializeUserRoleState();
  }

  private initializeUserRoleState() {
    this.userRoleService
      .getAction()
      .pipe(takeUntilDestroyed(this.destroyRef)) // Evita fugas de memoria
      .subscribe((action) => {
        this.canCancel.set(action?.anular); // Convierte a booleano
        this.canGenerateReport.set(action?.reporte);
        this.canCreate.set(action?.crear)
      });
  }
}
