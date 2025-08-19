import { inject, Injectable, InjectionToken } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

// 1. Define a configuration interface and InjectionToken for reusability
export type ToastrType = 'success' | 'error' | 'warning' | 'info';

export type ToastrNotificationConfig = Partial<IndividualConfig>;

export const TOASTR_NOTIFICATION_CONFIG =
  new InjectionToken<ToastrNotificationConfig>('toastr-notification-config', {
    // Default configuration if none is provided at the project level
    providedIn: 'root',
    factory: () => ({
      positionClass: 'toast-bottom-center',
      timeOut: 5000,
      extendedTimeOut: 1500,
      closeButton: true,
      newestOnTop: true,
    }),
  });

export interface ToastrCallProps {
  message: string;
  title?: string;
  options?: Partial<IndividualConfig>;
}
export interface ToastrShowProps extends ToastrCallProps {
  readonly type: ToastrType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastrNotificationService {
  private readonly toastrService = inject(ToastrService);
  // 2. Inject the configuration
  private readonly config = inject(TOASTR_NOTIFICATION_CONFIG);

  // 3. Create ergonomic helper methods for each type for better developer experience
  success(props: ToastrCallProps): void {
    this.show({ type: 'success', ...props });
  }

  error(props: ToastrCallProps): void {
    this.show({ type: 'error', ...props });
  }

  warning(props: ToastrCallProps): void {
    this.show({ type: 'warning', ...props });
  }

  info(props: ToastrCallProps): void {
    this.show({ type: 'info', ...props });
  }

  show(props: ToastrShowProps): void {
    const { type, message, title, options: overrideOptions } = props;
    const finalOptions = { ...this.config, ...overrideOptions };

    this.toastrService[type](message, title, finalOptions);
  }
}
