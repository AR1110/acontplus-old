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

//Legacy interface for backward compatibility --> delete when no longer needed
interface ToastrProps {
  type: 'success' | 'warning' | 'info' | 'error';
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
  success(
    message: string,
    title?: string,
    options?: Partial<IndividualConfig>,
  ): void {
    this.show('success', message, title, options);
  }

  error(
    message: string,
    title?: string,
    options?: Partial<IndividualConfig>,
  ): void {
    this.show('error', message, title, options);
  }

  warning(
    message: string,
    title?: string,
    options?: Partial<IndividualConfig>,
  ): void {
    this.show('warning', message, title, options);
  }

  info(
    message: string,
    title?: string,
    options?: Partial<IndividualConfig>,
  ): void {
    this.show('info', message, title, options);
  }

  // 4. A single, private, and efficient `show` method as the core logic
  private show(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title?: string,
    overrideOptions?: Partial<IndividualConfig>,
  ): void {
    // 5. Merge project-level default config with any per-call overrides
    const options = { ...this.config, ...overrideOptions };

    // 6. Use a direct method map for clean and maintainable code
    this.toastrService[type](message, title, options);
  }

  //Legacy method for backward compatibility --> delete when no longer needed
  toastr(props: ToastrProps) {
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
