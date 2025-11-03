import { Injectable, ElementRef, signal, computed, effect } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * Interfaz que define un elemento que puede recibir el foco y participar en la navegación por teclado.
 */
export interface FocusableElement {
  /** El ElementRef del elemento DOM */
  element: ElementRef;
  /** Un nombre único para identificar el elemento en el sistema de navegación */
  name: string;
  /** Callback opcional que se ejecuta cuando se presiona la flecha arriba y no hay más elementos arriba */
  onArrowUp?: () => void;
  /** Callback opcional que se ejecuta cuando se presiona la flecha abajo y no hay más elementos abajo */
  onArrowDown?: () => void;
  /** Callback opcional que se ejecuta cuando se presiona la flecha izquierda */
  onArrowLeft?: () => void;
  /** Callback opcional que se ejecuta cuando se presiona la flecha derecha */
  onArrowRight?: () => void;
  /** Callback opcional que se ejecuta cuando el elemento recibe el foco */
  onFocus?: (index?: number) => void;
  /** Callback opcional que se ejecuta cuando el índice enfocado dentro del elemento cambia (ej: una fila en una tabla) */
  onFocusedChange?: (index: number) => void;
}

/**
 * Servicio que gestiona la navegación por teclado entre componentes registrados.
 * Permite mover el foco entre elementos usando las teclas de flecha y centraliza el estado del foco.
 */
@Injectable({
  providedIn: 'root',
})
export class KeyboardNavigationService {
  /** Array privado que contiene todos los elementos registrados para la navegación */
  private focusableElements: FocusableElement[] = [];

  /** Signal que mantiene el índice del elemento actualmente enfocado en el array `focusableElements` */
  private currentFocusIndex = signal(-1);

  /** Subject para notificar la destrucción del servicio y limpiar suscripciones */
  private destroy$ = new Subject<void>();

  // --- Signals Públicos para Exponer el Estado ---

  /**
   * Signal público que expone el índice de la fila enfocada (usado por componentes como DataGrid).
   * Es un signal escribible porque el componente hijo (DataGrid) es quien actualiza su valor.
   */
  public focusedRowIndex = signal(-1);

  /**
   * Signal público que expone el nombre del elemento actualmente enfocado.
   * Es un signal `computed` que se deriva automáticamente del `currentFocusIndex` privado.
   */
  public focusedElementName = computed(() => {
    const index = this.currentFocusIndex();
    if (index >= 0 && index < this.focusableElements.length) {
      return this.focusableElements[index].name;
    }
    return '';
  });

  constructor() {
    // Este effect se dispara cada vez que el elemento enfocado cambia.
    // Es útil para realizar acciones secundarias si fuera necesario.
    effect(() => {
      const focusedElementIndex = this.currentFocusIndex();
      const focusedElementName = this.focusedElementName();
      console.log(
        `El foco cambió al elemento: ${focusedElementName} (índice: ${focusedElementIndex})`,
      );
    });
  }

  /**
   * Registra un nuevo elemento en el sistema de navegación por teclado.
   * @param element El objeto FocusableElement a registrar.
   */
  registerElement(element: FocusableElement) {
    if (!element || !element.element) {
      console.error(
        'KeyboardNavigationService: No se puede registrar el elemento. El ElementRef es undefined o nulo. ' +
          'Asegúrate de que el @ViewChild esté correctamente configurado y que el elemento exista en el DOM cuando ngAfterViewInit se ejecute.',
        element,
      );
      return; // Salimos del método para evitar el crash
    }
    this.focusableElements.push(element);

    // Configurar eventos de teclado para este elemento
    fromEvent<KeyboardEvent>(element.element.nativeElement, 'keydown')
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)),
      )
      .subscribe((event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del navegador (scroll, etc.)
        this.handleKeyNavigation(event.key);
      });

    // Configurar eventos de foco para este elemento
    fromEvent<FocusEvent>(element.element.nativeElement, 'focus')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const index = this.focusableElements.findIndex((e) => e.element === element.element);
        this.currentFocusIndex.set(index);

        // Ejecutar el callback onFocus si está definido
        if (element.onFocus) {
          element.onFocus(index);
        }
      });
  }

  /**
   * Elimina un elemento del sistema de navegación por teclado.
   * @param element El ElementRef del elemento a desregistrar.
   */
  unregisterElement(element: ElementRef) {
    const index = this.focusableElements.findIndex((e) => e.element === element);
    if (index !== -1) {
      this.focusableElements.splice(index, 1);

      // Si el elemento eliminado estaba enfocado, resetear el estado del foco
      if (this.currentFocusIndex() === index) {
        this.currentFocusIndex.set(-1);
      }
    }
  }

  /**
   * Mueve el foco a un elemento específico por su nombre.
   * @param name El nombre único del elemento al que se quiere mover el foco.
   * @param index Opcional: el índice interno a enfocar (ej: el índice de una fila en una tabla).
   */
  focusElement(name: string, index?: number) {
    const elementIndex = this.focusableElements.findIndex((e) => e.name === name);
    if (elementIndex !== -1) {
      this.currentFocusIndex.set(elementIndex);

      // Forzar el foco en el elemento del DOM
      this.focusableElements[elementIndex].element.nativeElement.focus();

      // Si el elemento tiene un callback de cambio de foco, llamarlo
      if (this.focusableElements[elementIndex].onFocusedChange && index !== undefined) {
        this.focusableElements[elementIndex].onFocusedChange(index);
      }
    }
  }

  /**
   * Actualiza el índice enfocado (usado por componentes internos como una tabla).
   * @param index El nuevo índice enfocado.
   */
  updateFocusedIndex(index: number) {
    this.focusedRowIndex.set(index);

    // Obtener el elemento actualmente enfocado y llamar a su callback
    const currentElement = this.focusableElements[this.currentFocusIndex()];
    if (currentElement?.onFocusedChange) {
      currentElement.onFocusedChange(index);
    }
  }

  /**
   * Maneja la lógica de navegación basada en la tecla presionada.
   * @param key La tecla presionada ('ArrowUp', 'ArrowDown', etc.).
   */
  private handleKeyNavigation(key: string) {
    if (this.currentFocusIndex() === -1) return;

    const currentElement = this.focusableElements[this.currentFocusIndex()];

    switch (key) {
      case 'ArrowUp':
        if (this.currentFocusIndex() > 0) {
          // Moverse al elemento anterior en la lista
          this.currentFocusIndex.set(this.currentFocusIndex() - 1);
          this.focusableElements[this.currentFocusIndex()].element.nativeElement.focus();
        } else if (currentElement.onArrowUp) {
          // Si no hay más elementos arriba, ejecutar el callback personalizado
          currentElement.onArrowUp();
        }
        break;

      case 'ArrowDown':
        if (this.currentFocusIndex() < this.focusableElements.length - 1) {
          // Moverse al siguiente elemento en la lista
          this.currentFocusIndex.set(this.currentFocusIndex() + 1);
          this.focusableElements[this.currentFocusIndex()].element.nativeElement.focus();
        } else if (currentElement.onArrowDown) {
          // Si no hay más elementos abajo, ejecutar el callback personalizado
          currentElement.onArrowDown();
        }
        break;

      case 'ArrowLeft':
        if (currentElement.onArrowLeft) {
          currentElement.onArrowLeft();
        }
        break;

      case 'ArrowRight':
        if (currentElement.onArrowRight) {
          currentElement.onArrowRight();
        }
        break;
    }
  }

  /**
   * Resetea el índice de la fila enfocada a -1.
   * Útil cuando los datos de un componente cambian y el foco anterior ya no es válido.
   */
  resetFocusedRowIndex() {
    this.focusedRowIndex.set(-1);
  }
  /**
   * Método de limpieza para ser llamado cuando el servicio se destruye.
   * Cierra el Subject `destroy$` para completar todas las suscripciones activas.
   */
  onDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
