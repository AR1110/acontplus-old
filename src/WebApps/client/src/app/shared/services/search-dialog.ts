import { Injectable, inject, Type } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchDialogService {
  private dgSvc = inject(DialogService);
  private defaultComponent?: Type<any>;
  private resultSubject = new Subject<any>();
  private isCtrlKOpen = false; // 👈 bandera de origen

  constructor() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const isK = event.key.toLowerCase() === 'k';
      const isMod = event.ctrlKey || event.metaKey;
      if (isMod && isK) {
        event.preventDefault();
        this.isCtrlKOpen = true; // marcamos que viene de Ctrl+K
        this.open();
      }
    });
  }

  onResult(): Observable<any> {
    return this.resultSubject.asObservable();
  }

  setDefaultComponent(component: Type<any>) {
    this.defaultComponent = component;
  }

  open(component?: Type<any>, data?: any) {
    if (document.querySelector('.dialog-shell')) return;

    const dialogComponent = component ?? this.defaultComponent;
    if (!dialogComponent) {
      console.warn('No component defined to open.');
      return;
    }

    const ref = this.dgSvc.open(dialogComponent, {
      size: 'xl',
      disableClose: false,
      data: data ?? {},
    });

    ref.subscribe((result) => {
      if (result !== undefined) {
        // 🔹 Solo emitimos a resultSubject si fue abierto por Ctrl+K
        if (this.isCtrlKOpen) {
          this.resultSubject.next(result);
          this.isCtrlKOpen = false;
          return
        }
      }
    });

    return ref;
  }
}
