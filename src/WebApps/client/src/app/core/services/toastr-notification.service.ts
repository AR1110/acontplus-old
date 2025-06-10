import { inject, Injectable, InjectionToken } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

// 1. Define a configuration interface and InjectionToken for reusability
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
  type?: 'success' | 'error' | 'warning' | 'info'; //Legacy support for backward compatibility
  message: string;
  title?: string;
  options?: Partial<IndividualConfig>;
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
    this.show('success', props);
  }

  error(props: ToastrCallProps): void {
    this.show('error', props);
  }

  warning(props: ToastrCallProps): void {
    this.show('warning', props);
  }

  info(props: ToastrCallProps): void {
    this.show('info', props);
  }

  // 4. A single, private, and efficient `show` method as the core logic
  private show(
    type: 'success' | 'error' | 'warning' | 'info',
    props: ToastrCallProps,
  ): void {
    const { message, title, options: overrideOptions } = props;

    // Merge project-level defaults with per-call overrides
    const finalOptions = { ...this.config, ...overrideOptions };

    this.toastrService[type](message, title, finalOptions);
  }

  //Legacy method for backward compatibility --> delete when no longer needed
  toastr(props: ToastrCallProps) {
    const { type, message, title } = props;
    const options = { ...this.config, ...props.options };

    if (type === 'success') {
      this.toastrService.success(message, title, options);
    }
    if (type === 'warning') {
      this.toastrService.warning(message, title, options);
    }
    if (type === 'info') {
      this.toastrService.info(message, title, options);
    }
    if (type === 'error') {
      this.toastrService.error(message, title, options);
    }
  }
}
