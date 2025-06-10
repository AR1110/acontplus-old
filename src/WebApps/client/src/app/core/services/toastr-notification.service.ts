import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface ToastrProps {
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  title?: string;
  positionClass?:
    | 'toast-bottom-center'
    | 'toast-bottom-right'
    | 'toast-bottom-left'
    | 'toast-top-center'
    | 'toast-top-right'
    | 'toast-top-left';
}

@Injectable({
  providedIn: 'root',
})
export class ToastrNotificationService {
  private readonly _tS = inject(ToastrService);

  toastr(props: ToastrProps) {
    const { type, message, title, positionClass } = props;
    const options = {
      closeButton: true,
      newestOnTop: true,
      positionClass: positionClass ? positionClass : 'toast-bottom-center',
      timeOut: 5000,
      extendedTimeOut: 1500,
    };
    if (type === 'success') {
      this._tS.success(message, title, options);
    }
    if (type === 'warning') {
      this._tS.warning(message, title, options);
    }
    if (type === 'info') {
      this._tS.info(message, title, options);
    }
    if (type === 'error') {
      this._tS.error(message, title, options);
    }
  }
}
